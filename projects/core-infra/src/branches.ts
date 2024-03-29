import * as gcp from '@pulumi/gcp';
import { interpolate } from '@pulumi/pulumi';
import { IdentityPoolGithubSetup } from './components/identity-pool-github';
import { branchesDevelopers, coreProject, organizationNumber } from './config';
import { provider as coreGoogleProvider } from './providers/core-google';
import { getGithubProvider } from './providers/github';

const branches = getGithubProvider('getbranches');

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

new gcp.folder.IAMMember(
  'branches-owner',
  {
    folder: folder.name,
    role: 'roles/owner',
    member: interpolate`serviceAccount:${serviceAccount.email}`,
  },
  { provider: coreGoogleProvider },
);

branchesDevelopers.map(developer => [
  new gcp.folder.IAMMember(`${developer}-viewer`, {
    folder: folder.name,
    role: 'roles/viewer',
    member: developer,
  }),
  new gcp.folder.IAMMember(`${developer}-folderViewer`, {
    folder: folder.name,
    role: 'roles/resourcemanager.folderViewer',
    member: developer,
  }),
]);
