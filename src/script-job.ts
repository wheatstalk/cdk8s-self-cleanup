import { posix as path } from 'path';
import { Construct } from 'constructs';
import * as k8s from './imports/k8s';

export interface ScriptJobProps {
  readonly script: string;
  readonly metadata?: k8s.ObjectMeta;
}

export class ScriptJob extends Construct {
  public readonly job: k8s.KubeJob;
  public readonly serviceAccount: k8s.KubeServiceAccount;

  constructor(scope: Construct, id: string, props: ScriptJobProps) {
    super(scope, id);

    const jobConfig = new k8s.KubeConfigMap(this, 'Config', {
      metadata: props.metadata,
      data: {
        [SCRIPT_NAME]: props.script,
      },
    });

    this.serviceAccount = new k8s.KubeServiceAccount(this, 'ServiceAccount', {
      metadata: props.metadata,
    });

    this.job = new k8s.KubeJob(this, 'Job', {
      metadata: props.metadata,
      spec: {
        template: {
          spec: {
            serviceAccount: this.serviceAccount.name,
            restartPolicy: 'OnFailure',
            containers: [
              {
                name: 'script',
                image: 'bitnami/kubectl',
                command: ['bash'],
                args: [SCRIPT_FULL_PATH],
                volumeMounts: [
                  {
                    name: SCRIPTS_VOLUME_NAME,
                    mountPath: SCRIPTS_DIR,
                  },
                ],
              },
            ],
            volumes: [
              {
                name: SCRIPTS_VOLUME_NAME,
                configMap: {
                  name: jobConfig.name,
                },
              },
            ],
          },
        },
      },
    });
  }
}

const SCRIPTS_DIR = '/scripts';
const SCRIPTS_VOLUME_NAME = 'scripts';
const SCRIPT_NAME = 'script.sh';
const SCRIPT_FULL_PATH = path.join(SCRIPTS_DIR, SCRIPT_NAME);