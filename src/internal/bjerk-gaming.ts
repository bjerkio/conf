import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { bjerkio } from '../github-orgs';

export const setup = new ProjectOnGithub(
  'bjerk-gaming',
  {
    projectName: 'bjerk-gaming',
    folderId: folder.id,
    repository: 'gaming',
  },
  { providers: [bjerkio] },
);
