import { App, Chart } from 'cdk8s';
import { createApiObjectHash } from '../src';
import { SomeDeployment } from '../src/some-deployment';

describe('createApiObjectHash', () => {
  test('stable hash', () => {
    const app1 = new App();
    const chart1 = new Chart(app1, 'Chart');
    new SomeDeployment(chart1, 'Id');
    const allNodes1 = chart1.node.findAll();

    const app2 = new App();
    const chart2 = new Chart(app2, 'Chart');
    new SomeDeployment(chart2, 'Id');
    const allNodes2 = chart2.node.findAll();

    // WHEN
    const hash1 = createApiObjectHash(allNodes1);
    const hash2 = createApiObjectHash(allNodes2);

    // THEN
    expect(hash1).toEqual(hash2);
  });

  test('rename a resource', () => {
    const app1 = new App();
    const chart1 = new Chart(app1, 'Chart');
    new SomeDeployment(chart1, 'Id');
    const allNodes1 = chart1.node.findAll();

    const app2 = new App();
    const chart2 = new Chart(app2, 'Chart');
    new SomeDeployment(chart2, 'Id2');
    const allNodes2 = chart2.node.findAll();

    // WHEN
    const hash1 = createApiObjectHash(allNodes1);
    const hash2 = createApiObjectHash(allNodes2);

    // THEN
    expect(hash1).not.toEqual(hash2);
  });

  test('add a resource', () => {
    const app1 = new App();
    const chart1 = new Chart(app1, 'Chart');
    new SomeDeployment(chart1, 'Id');
    const allNodes1 = chart1.node.findAll();

    const app2 = new App();
    const chart2 = new Chart(app2, 'Chart');
    new SomeDeployment(chart2, 'Id');
    new SomeDeployment(chart2, 'Id2');
    const allNodes2 = chart2.node.findAll();

    // WHEN
    const hash1 = createApiObjectHash(allNodes1);
    const hash2 = createApiObjectHash(allNodes2);

    // THEN
    expect(hash1).not.toEqual(hash2);
  });
});
