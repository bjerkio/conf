import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { provider } from './providers/core-google';

const identityPool = new gcp.iam.WorkloadIdentityPool(
  'core-github',
  {
    disabled: false,
    workloadIdentityPoolId: 'core-github',
  },
  { provider },
);

export const identityPoolProvider = new gcp.iam.WorkloadIdentityPoolProvider(
  'core-github',
  {
    workloadIdentityPoolId: identityPool.workloadIdentityPoolId,
    workloadIdentityPoolProviderId: 'core-github',
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

export const getIdentityPoolMember = (owner: string, repo: string) =>
  pulumi.interpolate`principalSet://iam.googleapis.com/${identityPool.name}/attribute.repository/${owner}/${repo}`;

export class GithubIdentityPoolIamMember extends pulumi.ComponentResource {
  public readonly member: pulumi.Output<string>;

  constructor(
    name: string,
    args: {
      owner: string;
      repo: string;
      serviceAccountId: pulumi.Input<string>;
    },
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('bjerkio:github:GithubIdentityPoolIamMember', name, {}, opts);
    const { owner, repo, serviceAccountId } = args;

    new gcp.serviceaccount.IAMMember(
      `iam-workload-${repo}`,
      {
        serviceAccountId,
        role: 'roles/iam.workloadIdentityUser',
        member: getIdentityPoolMember(args.owner, args.repo),
      },
      { provider, deleteBeforeReplace: true },
    );

    new gcp.serviceaccount.IAMMember(
      `iam-infra-token-${repo}`,
      {
        serviceAccountId,
        role: 'roles/iam.serviceAccountTokenCreator',
        member: pulumi.interpolate`principalSet://iam.googleapis.com/${identityPool.name}/attribute.repository/${owner}/${repo}`,
      },
      { provider, deleteBeforeReplace: true },
    );
  }
}
