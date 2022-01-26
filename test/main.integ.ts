import * as cdk8s from 'cdk8s';
import { Construct } from 'constructs';
import { SelfCleanup } from '../src/self-cleanup';
import { SomeDeployment } from '../src/some-deployment';

export class MyChart extends cdk8s.Chart {
  constructor(scope: Construct, id: string, props: cdk8s.ChartProps = { }) {
    super(scope, id, props);

    new SomeDeployment(this, 'SomeDeployment1');
    new SomeDeployment(this, 'SomeDeployment2');
    new SomeDeployment(this, 'SomeDeployment3');

    new SelfCleanup(this, 'SelfCleanup');
  }
}

const app = new cdk8s.App();
new MyChart(app, 'hello');

app.synth();