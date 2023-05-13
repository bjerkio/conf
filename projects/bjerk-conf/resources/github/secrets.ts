import * as github from '@pulumi/github';
import { github as config } from '../config';
import { gitHubIdentityPoolProvider } from '../google/identity-pool';
import { serviceAccount } from '../google/service-account';
import { getGithubProvider } from './providers';

const provider = getGithubProvider(config.owner);

new github.ActionsSecret(
  'google-service-account',
  {
    repository: config.repo,
    secretName: 'GOOGLE_SERVICE_ACCOUNT',
    plaintextValue: serviceAccount.email,
  },
  { provider, deleteBeforeReplace: true },
);

new github.ActionsSecret(
  'google-identity-provider',
  {
    repository: config.repo,
    secretName: 'WORKLOAD_IDENTITY_PROVIDER',
    plaintextValue: gitHubIdentityPoolProvider.name,
  },
  { provider, deleteBeforeReplace: true },
);
