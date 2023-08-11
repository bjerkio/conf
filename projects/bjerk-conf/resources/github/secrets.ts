import * as github from '@pulumi/github';
import { gitHubIdentityPoolProvider } from '../google/identity-pool';
import { serviceAccount } from '../google/service-account';
import { getGithubProvider } from './providers';

const owner = 'bjerkio';
const repo = 'conf';
const provider = getGithubProvider(owner);

new github.ActionsSecret(
  'google-service-account',
  {
    repository: repo,
    secretName: 'GOOGLE_SERVICE_ACCOUNT',
    plaintextValue: serviceAccount.email,
  },
  { provider, deleteBeforeReplace: true },
);

new github.ActionsSecret(
  'google-identity-provider',
  {
    repository: repo,
    secretName: 'WORKLOAD_IDENTITY_PROVIDER',
    plaintextValue: gitHubIdentityPoolProvider.name,
  },
  { provider, deleteBeforeReplace: true },
);
