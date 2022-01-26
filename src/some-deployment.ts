import { Construct } from 'constructs';
import * as k8s from './imports/k8s';

/**
 * Used for testing.
 *
 * @internal
 */
export class SomeDeployment extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const matchLabels = { app: 'hello-k8s' };
    new k8s.KubeDeployment(this, 'Deployment', {
      metadata: {
        labels: { app: 'hello-k8s' },
      },
      spec: {
        selector: {
          matchLabels,
        },
        template: {
          metadata: {
            labels: {
              ...matchLabels,
            },
          },
          spec: {
            containers: [{
              name: 'nginx',
              image: 'nginx:1.14-alpine',
              resources: {
                limits: {
                  memory: k8s.Quantity.fromString('20Mi'),
                  cpu: k8s.Quantity.fromNumber(0.25),
                },
              },
            }],
          },
        },
      },
    });
  }
}