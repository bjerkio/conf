import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { basssene } from '../github-orgs';

export const setup = new ProjectOnGithub(
  'bassene-web',
  {
    projectName: 'bassene-web',
    folderId: folder.id,
    repository: 'infra',
  },
  { providers: [basssene] },
);

