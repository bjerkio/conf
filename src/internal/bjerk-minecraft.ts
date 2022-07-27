import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { bjerkio } from '../github-orgs';

export const setup = new ProjectOnGithub(
  'bjerk-minecraft',
  {
    projectName: 'bjerk-minecraft',
    folderId: folder.id,
    repository: 'minecraft',
  },
  { providers: [bjerkio] },
);
