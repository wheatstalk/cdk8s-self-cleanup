# CDK8S Self Cleanup

This project provides a CDK8S construct that self-cleans old chart resources.
When you add this construct to your chart, you can remove resources from your
CDK8S app's charts and the construct will ensure that the old resources are
removed from your K8s cluster.

This construct uses a stable hashing algorithm to version the chart and label
resources so that it can identify old resources and create a job to delete
them for you.

## Usage

```ts
export class MyChart extends cdk8s.Chart {
  constructor(scope: Construct, id: string, props: cdk8s.ChartProps = { }) {
    super(scope, id, props);
    
    // TODO: Add your own resources here.

    // Add SelfCleanup to the end of your chart.
    new SelfCleanup(this, 'SelfCleanup');
  }
}
```