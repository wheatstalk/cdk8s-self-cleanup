const { cdk8s, javascript } = require('projen');

const project = new cdk8s.ConstructLibraryCdk8s({
  name: '@wheatstalk/cdk8s-self-cleanup',
  author: 'Josh Kellendonk',
  repository: 'https://github.com/wheatstalk/cdk8s-self-cleanup',
  description: 'Adds self-cleaning for old resources to your CDK8S charts',
  defaultReleaseBranch: 'main',

  npmAccess: javascript.NpmAccess.PUBLIC,
  cdk8sVersion: '2.1.0',
  constructsVersion: '10.0.0',

  depsUpgradeOptions: {
    ignoreProjen: false,
  },

  autoApproveOptions: {
    allowedUsernames: ['misterjoshua'],
  },

  devDeps: [
    'cdk8s-cli',
    'ts-node',
    'rimraf',
  ],
});

const deployTask = project.addTask('integ:main:deploy');
deployTask.exec('rimraf test/main.integ.snapshot');
deployTask.exec('cdk8s synth --app "ts-node -P tsconfig.dev.json test/main.integ.ts" --output test/main.integ.snapshot');
deployTask.exec('kubectl apply -f test/main.integ.snapshot');

project.addGitIgnore('/.idea');

project.synth();