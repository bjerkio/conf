import * as github from '@pulumi/github';
import { gitHubIdentityPoolProvider } from '../google/identity-pool';
import { serviceAccount } from '../google/service-account';
import { getGithubProvider } from './providers';
import { githubProvider } from '../../../bjerk-io/src/github';

const owner = 'bjerkio';
const repo = 'conf';

new github.ActionsSecret(
  'google-service-account',
  {
    repository: repo,
    secretName: 'GOOGLE_SERVICE_ACCOUNT',
    plaintextValue: serviceAccount.email,
  },
  { provider: githubProvider, deleteBeforeReplace: true },
);

new github.ActionsSecret(
  'google-identity-provider',
  {
    repository: repo,
    secretName: 'WORKLOAD_IDENTITY_PROVIDER',
    plaintextValue: gitHubIdentityPoolProvider.name,
  },
  { provider: githubProvider, deleteBeforeReplace: true },
);
