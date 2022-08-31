import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { bjerkio } from '../github-orgs';

export const setup = new ProjectOnGithub(
  'bjerk-tax-notifier',
  {
    projectName: 'bjerk-tax-notifier',
    folderId: folder.id,
    repositories: ['tax-notifier'],
  },
  { providers: [bjerkio] },
);
