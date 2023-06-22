import * as gcp from '@pulumi/gcp';
import { ProjectOnGithub } from '../components/projects-on-github';
import { developers } from '../config';
import { bjerkio } from '../github-orgs';
import { folder } from './folder';

export const setup = new ProjectOnGithub(
  'bjerk-io',
  {
    projectName: 'bjerk-io',
    folderId: folder.id,
    projectAliases: [
      'urn:pulumi:prod::bjerk-io-core::gcp:organizations/project:Project::bjerk-io',
    ],
  },
  { providers: [bjerkio] },
);

developers.map((developer) => new gcp.projects.IAMMember(
  `bjerk-io-${developer}-dns-admin`,
  {
    member: developer,
    role: 'roles/dns.admin',
    project: setup.project.projectId,
  },
  { provider: setup.googleProvider },
));

developers.map((developer) => new gcp.projects.IAMMember(
  `bjerk-io-${developer}-firebase-viewer`,
  {
    member: developer,
    role: 'roles/firebase.viewer',
    project: setup.project.projectId,
  },
  { provider: setup.googleProvider },
));

developers.map((developer) => new gcp.projects.IAMMember(
  `bjerk-io-${developer}-logging-viewer`,
  {
    member: developer,
    role: 'roles/logging.viewer',
    project: setup.project.projectId,
  },
  { provider: setup.googleProvider },
));
