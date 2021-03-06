import * as crypto from 'crypto';
import { ApiObject, Chart } from 'cdk8s';
import { Construct, ConstructOrder, IConstruct } from 'constructs';
import * as k8s from './imports/k8s';
import { ScriptJob } from './script-job';

/**
 * Props for SelfCleanup.
 */
export interface SelfCleanupProps {
  /**
   * Name of the self-cleanup label.
   *
   * @default 'self-cleanup'
   */
  readonly labelName?: string;
}

/**
 * Adds self-cleanup to the chart.
 *
 * SelfCleanup calculates a hash based on the types and names of all
 * ApiResources that it can find in the chart, then creates a job to
 * delete all labelled resources that don't match the current label
 * hash.
 */
export class SelfCleanup extends Construct {
  constructor(scope: Construct, id: string, props: SelfCleanupProps = {}) {
    super(scope, id);

    const labelName = props.labelName ?? 'self-cleanup';

    const chart = Chart.of(this);
    const allNodes = chart.node.findAll(ConstructOrder.POSTORDER);
    const labelHash = createApiObjectHash(allNodes);

    for (const node of allNodes) {
      if (node instanceof ApiObject) {
        node.metadata.addLabel(labelName, labelHash);
      }
    }

    const labels = {
      [labelName]: labelHash,
    };

    const selfCleanupScript = new ScriptJob(this, 'SelfCleanupScript', {
      metadata: {
        name: `self-cleanup-${labelHash}`,
        labels,
      },
      script: `kubectl delete $(kubectl api-resources --verbs=list --namespaced -o name | paste -s -d,) -l ${labelName},${labelName}!=${labelHash} || true`,
    });

    const role = new k8s.KubeRole(this, 'JobRole', {
      metadata: { labels },
      rules: [
        {
          apiGroups: ['*'],
          resources: ['*'],
          verbs: ['delete', 'list'],
        },
      ],
    });

    new k8s.KubeRoleBinding(this, 'JobRoleBinding', {
      metadata: { labels },
      roleRef: {
        apiGroup: '',
        kind: role.kind,
        name: role.name,
      },
      subjects: [
        {
          apiGroup: '',
          kind: selfCleanupScript.serviceAccount.kind,
          name: selfCleanupScript.serviceAccount.name,
        },
      ],
    });
  }
}

/** @internal */
export function createApiObjectHash(allNodes: IConstruct[]) {
  const hashFunc = crypto.createHash('sha256');
  for (const node of allNodes) {
    if (node instanceof ApiObject) {
      hashFunc.update([
        node.apiGroup,
        node.apiVersion,
        node.kind,
        node.name,
      ].join('.'));
    }
  }

  return hashFunc.digest().toString('hex').substring(0, 6);
}