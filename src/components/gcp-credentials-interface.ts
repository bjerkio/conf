import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as github from '@pulumi/github';

export interface GCPCredentialsArgs {
  repositories: pulumi.Input<string>[];
  projectId: pulumi.Input<string>;
  serviceAccount: gcp.serviceaccount.Account;
}

export interface GCPCredentials {}
