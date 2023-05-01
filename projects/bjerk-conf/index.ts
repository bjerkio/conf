import * as pulumi from '@pulumi/pulumi';
import { github } from './resources/config';
import { serviceAccount } from './resources/google/service-account';
import './resources/github/secrets';
import './resources/google/api-services';

export const serviceAccountEmail = pulumi.secret(serviceAccount.email);
export const gitHubToken = pulumi.secret(github.token);
