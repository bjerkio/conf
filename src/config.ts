import * as pulumi from '@pulumi/pulumi';

export const config = new pulumi.Config();
export const billingAccount = config.requireSecret('billingAccount');
export const organizationNumber = 904377566042;
export const pulumiAccessToken = pulumi.secret<string>(process.env.PULUMI_ACCESS_TOKEN);
export const githubToken = pulumi.secret<string>(process.env.GITHUB_TOKEN);

export const coreProject = 'bjerk-core';

const branchesConfig = new pulumi.Config('branches');
export const branchesDevelopers = branchesConfig.requireObject<string[]>('developers');
