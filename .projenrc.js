const { cdk8s, javascript } = require('projen');

const project = new cdk8s.ConstructLibraryCdk8s({
  name: '@wheatstalk/cdk8s-self-cleanup',
  author: 'Josh Kellendonk',
  repository: 'https://github.com/wheatstalk/cdk8s-self-cleanup',
  description: 'Adds self-cleaning for old resources to your CDK8S charts',
  defaultReleaseBranch: 'main',

  npmAccess: javascript.NpmAccess.PUBLIC,
  cdk8sVersion: '2.0.0',
  constructsVersion: '10.0.0',

  depsUpgradeOptions: {
    ignoreProjen: false,
  },

  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ['misterjoshua'],
  },

  devDeps: [
    'cdk8s-cli',
    'ts-node',
    'rimraf',
  ],
});

project.addGitIgnore('/.idea');

project.synth();
