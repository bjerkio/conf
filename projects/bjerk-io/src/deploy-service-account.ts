import * as gcp from '@pulumi/gcp';
import * as github from '@pulumi/github';
import * as pulumi from '@pulumi/pulumi';

const serviceAccount = new gcp.serviceaccount.Account('deploy-sa', {
  accountId: 'frontend-deploy',
});

const saKey = new gcp.serviceaccount.Key('sa-key', {
  serviceAccountId: serviceAccount.accountId,
});

new gcp.projects.IAMMember('deploy-firebase-iam', {
  project: 'bjerk-io',
  member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
  role: 'roles/firebasehosting.admin',
});

new github.ActionsSecret('deploy-url', {
  secretName: 'GOOGLE_PROJECT_SA_KEY',
  plaintextValue: saKey.privateKey.apply(k =>
    Buffer.from(k, 'base64').toString('utf-8'),
  ),
  repository: 'website',
});
