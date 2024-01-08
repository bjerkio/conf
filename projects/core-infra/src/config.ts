import * as pulumi from '@pulumi/pulumi';

export const config = new pulumi.Config();
export const billingAccount = config.requireSecret('billingAccount');
export const organizationNumber = 904377566042;
const pulumiConfig = new pulumi.Config('pulumi');
export const pulumiAccessToken = pulumiConfig.requireSecret('token');

export const coreProject = 'bjerk-core';

const branchesConfig = new pulumi.Config('branches');
export const branchesDevelopers =
  branchesConfig.requireObject<string[]>('developers');

export const developers = config.requireObject<string[]>('developers');
export const internalViewers =
  config.requireObject<string[]>('internal-viewers');

export const githubToken = config.requireSecret('github:token');
