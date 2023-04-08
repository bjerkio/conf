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

export const getIdentityPoolMember = (
  owner: pulumi.Input<string>,
  repo: pulumi.Input<string>,
) =>
  pulumi.interpolate`principalSet://iam.googleapis.com/${identityPool.name}/attribute.repository/${owner}/${repo}`;

export class GithubIdentityPoolIamMember extends pulumi.ComponentResource {
  public readonly member: pulumi.Output<string>;

  constructor(
    name: string,
    args: {
      owner: pulumi.Input<string>;
      repo: pulumi.Input<string>;
      serviceAccountId: pulumi.Input<string>;
    },
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('bjerkio:github:GithubIdentityPoolIamMember', name, {}, opts);
    const { serviceAccountId } = args;

    new gcp.serviceaccount.IAMMember(
      `iam-workload-${name}`,
      {
        serviceAccountId,
        role: 'roles/iam.workloadIdentityUser',
        member: getIdentityPoolMember(args.owner, args.repo),
      },
      { parent: this, provider, deleteBeforeReplace: true },
    );

    new gcp.serviceaccount.IAMMember(
      `iam-infra-token-${name}`,
      {
        serviceAccountId,
        role: 'roles/iam.serviceAccountTokenCreator',
        member: getIdentityPoolMember(args.owner, args.repo),
      },
      { parent: this, provider, deleteBeforeReplace: true },
    );
  }
}
