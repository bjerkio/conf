import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { provider } from './provider';

const identityPool = new gcp.iam.WorkloadIdentityPool(
  'main-identity-pool',
  {
    disabled: false,
    workloadIdentityPoolId: 'bjerk-conf',
  },
  { provider },
);

export const gitHubIdentityPoolProvider =
  new gcp.iam.WorkloadIdentityPoolProvider(
    'github-identity-provider',
    {
      workloadIdentityPoolId: identityPool.workloadIdentityPoolId,
      workloadIdentityPoolProviderId: 'main-github',
      oidc: {
        issuerUri: 'https://token.actions.githubusercontent.com',
      },
      attributeMapping: {
        'google.subject': 'assertion.sub',
        'attribute.actor': 'assertion.actor',
        'attribute.repository': 'assertion.repository',
      },
    },
    { provider },
  );

export const getIdentityPoolMember = (
  owner: pulumi.Input<string>,
  repo: pulumi.Input<string>,
): pulumi.Output<string> =>
  pulumi.interpolate`principalSet://iam.googleapis.com/${identityPool.name}/attribute.repository/${owner}/${repo}`;
