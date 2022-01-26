import * as crypto from 'crypto';
import { ApiObject, Chart, JsonPatch } from 'cdk8s';
import { Construct, ConstructOrder, IConstruct } from 'constructs';
import * as k8s from './imports/k8s';
import { ScriptJob } from './script-job';

/**
 * Adds self-cleanup to the chart.
 *
 * SelfCleanup calculates a hash based on the types and names of all
 * ApiResources that it can find in the chart, then creates a job to
 * delete all labelled resources that don't match the current label
 * hash.
 */
export class SelfCleanup extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const labelName = 'self-cleanup';
    const chart = Chart.of(this);
    const allNodes = chart.node.findAll(ConstructOrder.POSTORDER);
    const labelHash = createApiObjectHash(allNodes);

    for (const node of allNodes) {
      if (node instanceof ApiObject) {
        node.addJsonPatch(
          JsonPatch.add(`/metadata/labels/${labelName}`, labelHash),
        );
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
      script: `kubectl delete all -l ${labelName},${labelName}!=${labelHash} || true`,
    });

    // @ts-ignore
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