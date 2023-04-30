import * as gcp from '@pulumi/gcp';
import * as github from '@pulumi/github';
import * as pulumi from '@pulumi/pulumi';
import { interpolate } from '@pulumi/pulumi';
import {
  billingAccount as defaultBillingAccount,
  pulumiAccessToken,
} from '../config';
import { provider as coreProvider } from '../providers/core-google';
import { invariant } from '../utils';
import { IdentityPoolGithubSetup } from './identity-pool-github';

export interface ProjectOnGithubSpec {
  projectName?: pulumi.Input<string>;
  folderId?: pulumi.Input<string>;
  project?: gcp.organizations.Project;
  /* @deprecated Use repositories instead */
  repository?: pulumi.Input<string>;
  repositories?: pulumi.Input<string>[];
  projectAliases?: pulumi.Input<pulumi.URN | pulumi.Alias>[];

  /**
   * Defaults to the billing account in config.ts
   */
  billingAccount?: pulumi.Input<string>;

  /**
   * Add Pulumi access token to GitHub secrets
   * @default false
   */
  addPulumiAccessToken?: boolean;

  serviceAccountRole?: pulumi.Input<string>;

  owners?: pulumi.Input<string>[];
}

export class ProjectOnGithub extends pulumi.ComponentResource {
  readonly project: gcp.organizations.Project;

  // Google Provider
  readonly googleProvider: gcp.Provider;

  readonly serviceAccount: gcp.serviceaccount.Account;

  readonly roles: pulumi.Output<gcp.projects.IAMMember[]>;
  readonly serviceAccountRole: gcp.projects.IAMMember;

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
      addPulumiAccessToken = false,
      serviceAccountRole = 'roles/owner',
      billingAccount = defaultBillingAccount,
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
            name: pulumi.output(projectName).apply(p => p || ''),
            projectId: pulumi.output(projectName).apply(p => p || ''),
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
        accountId: interpolate`${name}-deployer`,
        displayName: interpolate`${this.project.projectId} Service Account`,
        description: interpolate`GitHub Action access to ${this.project.projectId}`,
      },
      { provider: coreProvider, parent: this },
    );

    if (serviceAccountRole) {
      this.serviceAccountRole = new gcp.projects.IAMMember(
        `${name}-service-account`,
        {
          member: pulumi.interpolate`serviceAccount:${this.serviceAccount.email}`,
          role: serviceAccountRole,
          project: this.project.projectId,
        },
        {
          parent: this,
          provider: this.googleProvider,
          aliases: [
            {
              name: `${name}-service-account`,
              parent: `urn:pulumi:prod::bjerk-core-infra::bjerk:project$bjerk:github-gcp-service-account-credentials::${name}`,
            },
          ],
        },
      );
    }

    this.roles = pulumi.all(owners).apply(owners =>
      owners.map(
        member =>
          new gcp.projects.IAMMember(
            `${name}-owner-${member}`,
            {
              member,
              role: 'roles/owner',
              project: this.project.projectId,
            },
            { provider: this.googleProvider, parent: this },
          ),
      ),
    );

    repositories.map(repository => {
      const owner = pulumi.output(repository).apply(async name => {
        const repo = await github.getRepository(
          {
            name,
          },
          { parent: this },
        );

        const fullName = repo.fullName;
        if (!fullName) {
          throw new Error(`Could not find repository ${name}`);
        }

        return fullName.split('/')[0];
      });

      return new IdentityPoolGithubSetup(
        `${repository}-${name}-gh-identity-pool`,
        {
          repo: repository,
          owner,
          serviceAccountId: this.serviceAccount.id,
          serviceAccountEmail: this.serviceAccount.email,
          projectId: this.project.projectId,
        },
        { parent: this },
      );
    });

    if (addPulumiAccessToken) {
      repositories.map(
        repository =>
          new github.ActionsSecret(
            `${repository}-${name}-pulumi`,
            {
              secretName: 'PULUMI_ACCESS_TOKEN',
              plaintextValue: pulumiAccessToken.apply(t => t || ''),
              repository,
            },
            { parent: this },
          ),
      );
    }
  }
}
