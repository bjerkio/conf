import * as gcp from '@pulumi/gcp';
import { interpolate } from '@pulumi/pulumi';
import { IdentityPoolGithubSetup } from './components/identity-pool-github';
import {
  billingAccount,
  branchesDevelopers,
  coreProject,
  organizationNumber,
} from './config';
import { branches } from './github-orgs';
import { provider as coreGoogleProvider } from './providers/core-google';

export const folder = new gcp.organizations.Folder(
  'branches-folder',
  {
    displayName: 'Branches',
    parent: `organizations/${organizationNumber}`,
  },
  { provider: coreGoogleProvider },
);

const serviceAccount = new gcp.serviceaccount.Account(
  'conf-deployer',
  {
    accountId: 'conf-deployer',
  },
  { provider: coreGoogleProvider },
);

new IdentityPoolGithubSetup(
  'conf',
  {
    repo: 'conf',
    owner: 'getbranches',
    serviceAccountId: serviceAccount.id,
    serviceAccountEmail: serviceAccount.email,
    projectId: coreProject,
  },
  { providers: [coreGoogleProvider, branches] },
);

new gcp.folder.IAMMember(
  'branches-project-creator',
  {
    folder: folder.name,
    role: 'roles/resourcemanager.projectCreator',
    member: interpolate`serviceAccount:${serviceAccount.email}`,
  },
  { provider: coreGoogleProvider },
);

branchesDevelopers.map(
  developer =>
    new gcp.serviceaccount.IAMMember(`${developer}-branches-impersonation`, {
      serviceAccountId: serviceAccount.id,
      role: 'roles/iam.serviceAccountTokenCreator',
      member: `user:${developer}`,
    }),
);
