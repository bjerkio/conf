import * as github from '@pulumi/github';
import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('github');

export const githubProvider = new github.Provider('gh-provider', {
  owner: 'bjerkio',
  token: config.requireSecret('token'),
});
