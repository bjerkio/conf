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
    const {
      repositories,
      projectId,
      serviceAccount,
    } = args;

    this.serviceAccountKey = new gcp.serviceaccount.Key(
      name,
      {
        serviceAccountId: serviceAccount.accountId,
      },
      {
        parent: this,
        aliases: [
          {
            name,
            parent: `urn:pulumi:prod::bjerk-core-infra::bjerk:project::${name}`,
          },
        ],
      },
    );

    this.secrets = pulumi.output([
      // GCP Project access
      ...repositories.map(
        (repository) =>
          new github.ActionsSecret(
            `${repository}-${name}-gcp-key`,
            {
              secretName: 'GOOGLE_PROJECT_SA_KEY',
              plaintextValue: this.serviceAccountKey.privateKey,
              repository,
            },
            {
              parent: this,
              aliases: [
                {
                  name: `${repository}-${name}-gcp-key`,
                  parent: `urn:pulumi:prod::bjerk-core-infra::bjerk:project::${name}`,
                },
              ],
            },
          ),
      ),
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
