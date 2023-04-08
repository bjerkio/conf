import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { bjerkio } from '../github-orgs';

export const setup = new ProjectOnGithub(
  'bjerk-io',
  {
    projectName: 'bjerk-io',
    folderId: folder.id,
    repository: 'infra-bjerk-io',
    projectAliases: [
      'urn:pulumi:prod::bjerk-io-core::gcp:organizations/project:Project::bjerk-io',
    ],
  },
  { providers: [bjerkio] },
);
