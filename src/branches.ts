import * as gcp from '@pulumi/gcp';
import { IdentityPoolGithubSetup } from './components/identity-pool-github';
import { coreProject, organizationNumber } from './config';
import { provider as coreGoogleProvider } from './providers/core-google';
import { interpolate } from '@pulumi/pulumi';
import { branches } from './github-orgs';

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
