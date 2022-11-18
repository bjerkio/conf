import * as gcp from '@pulumi/gcp';
import { provider } from './providers/core-google';

new gcp.projects.IAMMember(
  'core-iam',
  {
    role: 'roles/owner',
    member: 'serviceAccount:deploy@bjerk-core.iam.gserviceaccount.com',
  },
  { provider },
);
