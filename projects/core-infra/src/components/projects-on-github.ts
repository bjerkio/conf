import * as gcp from '@pulumi/gcp';
import * as github from '@pulumi/github';
import * as pulumi from '@pulumi/pulumi';
import { interpolate } from '@pulumi/pulumi';
import { isPast } from 'date-fns';
import {
  billingAccount as defaultBillingAccount,
  pulumiAccessToken,
} from '../config';
import { provider as coreProvider } from '../providers/core-google';
import { invariant, notEmpty } from '../utils';
import { IdentityPoolGithubSetup } from './identity-pool-github';

// TODO: Wrap expiresAt with pulumi.Input
interface ProjectRole {
  role: pulumi.Input<string>;
  member: pulumi.Input<string>;

  /**
   * Required for admin roles
   */
  expiresAt?: Date;
}

// Google administrator roles
const adminRoles: string[] = [
  'roles/owner',
  'roles/resourcemanager.projectIamAdmin',
  'roles/resourcemanager.folderIamAdmin',
  'roles/resourcemanager.organizationAdmin',
  'roles/billing.admin',
  'roles/iam.organizationRoleAdmin',
  'roles/iam.securityAdmin',
  'roles/iam.serviceAccountAdmin',
  'roles/iam.serviceAccountKeyAdmin',
  'roles/iam.serviceAccountTokenCreator',
  'roles/iam.roleAdmin',
  'roles/iam.roleViewer',
  'roles/iam.roleEditor',
  'roles/iam.securityReviewer',
  'roles/iam.workloadIdentityUser',
  'roles/iam.workloadIdentityUserAdmin',
  'roles/iam.workloadIdentityPoolAdmin',
  'roles/iam.workloadIdentityPoolViewer',
  'roles/iam.workloadIdentityPoolAdmin',
];

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

  /**
   * Roles added with this will not be applied.
   *
   * @deprecated use projectRoles instead
   */
  owners?: pulumi.Input<string>[];

  /**
   * Roles applied to the project
   *
   * Note: Roles should mostly be applied to spesific resources, not the project.
   * Use this with caution.
   *
   */
  roles?: pulumi.Input<ProjectRole>[];
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
      roles = [],
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

    this.roles = pulumi.all(roles).apply(unwrappedRoles =>
      unwrappedRoles
        .map(({ member, role, expiresAt }) => {
          if (adminRoles.includes(role)) {
            if (!expiresAt) {
              throw new Error(
                `Admin roles require an expiresAt date. ${role} is missing expiresAt`,
              );
            }

            if (isPast(expiresAt)) {
              pulumi.log.warn(
                `Admin role ${role} expires in the past. This will not be applied.`,
              );
              return;
            }
          }

          if (expiresAt && isPast(expiresAt)) {
            pulumi.log.warn(
              `Role ${role} expires in the past. This will not be applied.`,
            );
            return;
          }

          return new gcp.projects.IAMMember(
            `${name}-owner-${member}`,
            {
              member,
              role,
              project: this.project.projectId,
            },
            { provider: this.googleProvider, parent: this },
          );
        })
        .filter(notEmpty),
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
