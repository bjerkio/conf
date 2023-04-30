import * as pulumi from '@pulumi/pulumi';

export const config = new pulumi.Config();
export const billingAccount = config.requireSecret('billingAccount');
export const organizationNumber = 904377566042;
const pulumiConfig = new pulumi.Config('pulumi');
export const pulumiAccessToken = pulumiConfig.requireSecret('token');
const githubConfig = new pulumi.Config('github');
export const githubToken = githubConfig.requireSecret('token');

export const coreProject = 'bjerk-core';

const branchesConfig = new pulumi.Config('branches');
export const branchesDevelopers =
  branchesConfig.requireObject<string[]>('developers');

export const developers = config.requireObject<string[]>('developers');
