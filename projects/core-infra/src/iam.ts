import * as gcp from '@pulumi/gcp';
import { developers, organizationNumber } from './config';

developers.map(
  member =>
    new gcp.organizations.IAMMember(`${member}-org-developer-browsers`, {
      orgId: String(organizationNumber),
      role: 'roles/browser',
      member,
    }),
);
