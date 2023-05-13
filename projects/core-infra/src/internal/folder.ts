import * as gcp from '@pulumi/gcp';
import { internalViewers, organizationNumber } from '../config';

export const folder = new gcp.organizations.Folder('internal-folder', {
  displayName: 'Internal',
  parent: `organizations/${organizationNumber}`,
});

export const viewerUsers = internalViewers.map(member => [
  new gcp.folder.IAMMember(`${member}-developer-viewer`, {
    folder: folder.name,
    role: 'roles/viewer',
    member,
  }),
]);
