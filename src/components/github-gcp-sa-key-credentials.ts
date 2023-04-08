import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as github from '@pulumi/github';
import {
  GCPCredentials,
  GCPCredentialsArgs,
} from './gcp-credentials-interface';

export class GitHubGCPServiceAccountKeyCredentials
  extends pulumi.ComponentResource
  implements GCPCredentials {
  readonly serviceAccountKey: gcp.serviceaccount.Key;

  readonly secrets: pulumi.Output<github.ActionsSecret[]>;

  constructor(
    name: string,
    args: GCPCredentialsArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('bjerk:github-gcp-service-account-credentials', name, args, opts);
    const { repositories, projectId } = args;

    pulumi.log.warn(
      `This component is deprecated. Please move ${name} to use the new component instead.`,
    );

    this.secrets = pulumi.output([
      // Google project ID
      ...repositories.map(
        (repository) =>
          new github.ActionsSecret(
            `${repository}-${name}-gcp-project`,
            {
              secretName: 'GOOGLE_PROJECT_ID',
              plaintextValue: projectId,
              repository,
            },
            {
              parent: this,
              aliases: [
                {
                  name: `${repository}-${name}-gcp-project`,
                  parent: `urn:pulumi:prod::bjerk-core-infra::bjerk:project::${name}`,
                },
              ],
            },
          ),
      ),
    ]);
  }
}
