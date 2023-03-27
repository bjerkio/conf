import * as pulumi from '@pulumi/pulumi';
import { billingAccount, pulumiAccessToken } from '../config';
import * as gcp from '@pulumi/gcp';
import * as github from '@pulumi/github';
import { invariant } from '../utils';
import { GCPCredentials } from './gcp-credentials-interface';
import { GitHubGCPServiceAccountKeyCredentials } from './github-gcp-sa-key-credentials';

export interface ProjectOnGithubSpec {
  projectName?: pulumi.Input<string>;
  folderId?: pulumi.Input<string>;
  project?: gcp.organizations.Project;
  /* @deprecated Use repositories instead */
  repository?: pulumi.Input<string>;
  repositories?: pulumi.Input<string>[];
  projectAliases?: pulumi.Input<pulumi.URN | pulumi.Alias>[];

  /**
   * @default service-account-key
   *
   *
   * TODO: Add 'identity-pool' as an option
   */
  credentialsType?: 'service-account-key';

  /**
   * Add Pulumi access token to GitHub secrets
   * @default true
   */
  addPulumiAccessToken?: boolean;

  owners?: pulumi.Input<string>[];
}

export class ProjectOnGithub extends pulumi.ComponentResource {
  readonly project: gcp.organizations.Project;

  // Google Provider
  readonly googleProvider: gcp.Provider;

  // Credentials
  readonly credentials: GCPCredentials;

  readonly serviceAccount: gcp.serviceaccount.Account;

  readonly roles: pulumi.Output<gcp.projects.IAMMember[]>;

  constructor(
    name: string,
    args: ProjectOnGithubSpec,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('bjerk:project', name, args, opts);

    const {
      project,
      projectName,
      folderId,
      repositories = args.repository ? [args.repository] : [],
      projectAliases,
      owners = [],
      credentialsType = 'service-account-key',
      addPulumiAccessToken = true,
    } = args;

    if (!project) {
      invariant(projectName, 'expect projectName when no project is attached');
      invariant(folderId, 'expect folderId name when no project is attached');
    }

    this.project = project
      ? project
      : new gcp.organizations.Project(
          name,
          {
            autoCreateNetwork: true,
            billingAccount,
            name: pulumi.output(projectName).apply((p) => p || ''),
            projectId: pulumi.output(projectName).apply((p) => p || ''),
            folderId,
          },
          { protect: true, parent: this, aliases: projectAliases },
        );

    this.googleProvider = new gcp.Provider(
      name,
      {
        project: this.project.projectId,
      },
      { parent: this },
    );

    this.serviceAccount = new gcp.serviceaccount.Account(
      name,
      {
        accountId: 'deploy',
      },
      { provider: this.googleProvider, parent: this },
    );

    this.roles = pulumi.all(owners).apply((owners) =>
      owners.map(
        (member) =>
          new gcp.projects.IAMMember(
            `${name}-owner-${member}`,
            {
              member,
              role: 'roles/owner',
            },
            { parent: this },
          ),
      ),
    );

    if (credentialsType === 'service-account-key') {
      this.credentials = new GitHubGCPServiceAccountKeyCredentials(
        name,
        {
          repositories,
          projectId: this.project.projectId,
          owners,
          serviceAccount: this.serviceAccount,
        },
        { providers: [this.googleProvider], parent: this },
      );
    }

    if (addPulumiAccessToken) {
      repositories.map(
        (repository) =>
          new github.ActionsSecret(
            `${repository}-${name}-pulumi`,
            {
              secretName: 'PULUMI_ACCESS_TOKEN',
              plaintextValue: pulumiAccessToken.apply((t) => t || ''),
              repository,
            },
            { parent: this },
          ),
      );
    }
  }
}
