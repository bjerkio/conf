import * as gcp from '@pulumi/gcp';
import { internalViewers, organizationNumber } from '../config';

export const folder = new gcp.organizations.Folder('customer-folder', {
  displayName: 'Customers',
  parent: `organizations/${organizationNumber}`,
});

export const viewerUsers = internalViewers.map(member => [
  new gcp.folder.IAMMember(`${member}-customer-developer-browser`, {
    folder: folder.name,
    role: 'roles/browser',
    member,
  }),
]);
