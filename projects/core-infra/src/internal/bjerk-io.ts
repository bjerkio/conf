import { ProjectOnGithub } from '../components/projects-on-github';
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
