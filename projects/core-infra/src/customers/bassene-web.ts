import { ProjectOnGithub } from '../components/projects-on-github';
import { basssene } from '../github-orgs';
import { folder } from './folder';

export const setup = new ProjectOnGithub(
  'bassene-web',
  {
    projectName: 'bassene-web',
    folderId: folder.id,
    repository: 'conf',
  },
  { providers: [basssene] },
);
