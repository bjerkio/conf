import * as pulumi from '@pulumi/pulumi';
import { serviceAccount } from './resources/google/service-account';
import './resources/github/secrets';

export const serviceAccountEmail = pulumi.secret(serviceAccount.email);
