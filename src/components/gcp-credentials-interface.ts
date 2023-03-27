import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as github from '@pulumi/github';

export interface GCPCredentialsArgs {
  repositories: pulumi.Input<string>[];
  projectId: pulumi.Input<string>;
  serviceAccount: gcp.serviceaccount.Account;
  owners?: pulumi.Input<string>[];

  /**
   * @default 'roles/owner'
   *
   * Use false to disable
   */
  serviceAccountRole?: string | false;
}

export interface GCPCredentials {
  readonly secrets: pulumi.Output<github.ActionsSecret[]>;
}
