import * as gcp from '@pulumi/gcp';
import { developers, organizationNumber } from './config';

developers.map(
  member =>
    new gcp.organizations.IAMMember(`${member}-org-developer-folderViewer`, {
      orgId: String(organizationNumber),
      role: 'roles/resourcemanager.folderViewer',
      member,
    }),
);
