import * as gcp from '@pulumi/gcp';
import { github } from '../config';
import { getIdentityPoolMember } from './identity-pool';
import { provider } from './provider';

export const serviceAccount = new gcp.serviceaccount.Account(
  'bjerk-conf',
  {
    accountId: 'bjerk-conf',
    displayName: 'Main service account',
    description:
      'Maintains access to all resources in the project, and is used by GitHub Actions to deploy',
  },
  { provider },
);

new gcp.serviceaccount.IAMMember(
  'bjerk-conf-workload-identity-user-role',
  {
    serviceAccountId: serviceAccount.id,
    role: 'roles/iam.workloadIdentityUser',
    member: getIdentityPoolMember(github.owner, github.repo),
  },
  { provider, deleteBeforeReplace: true },
);

new gcp.serviceaccount.IAMMember(
  'bjerk-conf-service-account-token-creator-role',
  {
    serviceAccountId: serviceAccount.id,
    role: 'roles/iam.serviceAccountTokenCreator',
    member: getIdentityPoolMember(github.owner, github.repo),
  },
  { provider, deleteBeforeReplace: true },
);
