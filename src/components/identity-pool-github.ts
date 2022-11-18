import * as pulumi from '@pulumi/pulumi';
import * as github from '@pulumi/github';
import {
  GithubIdentityPoolIamMember,
  identityPoolProvider,
} from '../identity-pool';

export interface IdentityPoolGithubArgs {
  repo: string;
  owner: string;
  serviceAccountId: pulumi.Input<string>;
  projectId: pulumi.Input<string>;
}

export class IdentityPoolGithubSetup extends pulumi.ComponentResource {
  constructor(
    name: string,
    args: IdentityPoolGithubArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('bjerkio:github:IdentityPoolGithub', name, args, opts);
    const { repo, owner, serviceAccountId, projectId } = args;

    new GithubIdentityPoolIamMember(
      name,
      { repo, owner, serviceAccountId },
      { parent: this },
    );

    new github.ActionsSecret(
      `${name}-google-projects`,
      {
        repository: repo,
        secretName: 'GOOGLE_PROJECT_ID',
        plaintextValue: projectId,
      },
      { parent: this, deleteBeforeReplace: true },
    );

    new github.ActionsSecret(
      `${name}-identity-provider`,
      {
        repository: repo,
        secretName: 'WORKLOAD_IDENTITY_PROVIDER',
        plaintextValue: identityPoolProvider.name,
      },
      { parent: this, deleteBeforeReplace: true },
    );
  }
}
