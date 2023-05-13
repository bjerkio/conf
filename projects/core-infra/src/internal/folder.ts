import * as gcp from '@pulumi/gcp';
import { internalViewers, organizationNumber } from '../config';

export const folder = new gcp.organizations.Folder('internal-folder', {
  displayName: 'Internal',
  parent: `organizations/${organizationNumber}`,
});

export const viewerUsers = internalViewers.map(member => [
  new gcp.folder.IAMMember(`${member}-internal-developer-browser`, {
    folder: folder.name,
    role: 'roles/browser',
    member,
  }),
]);
