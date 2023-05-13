import * as gcp from '@pulumi/gcp';
import { internalViewers, organizationNumber } from '../config';

export const folder = new gcp.organizations.Folder('customer-folder', {
  displayName: 'Customers',
  parent: `organizations/${organizationNumber}`,
});

export const viewerUsers = internalViewers.map(member => [
  new gcp.folder.IAMMember(`${member}-developer-viewer`, {
    folder: folder.name,
    role: 'roles/browser',
    member,
  }),
]);
