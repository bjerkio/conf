import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { getGithubProvider } from '../providers/github';

const flexiSoft = getGithubProvider('flexisoftorg');
export const setup = new ProjectOnGithub(
  'flexisoft',
  {
    projectName: 'flexisoft-app',
    folderId: folder.id,
    repository: 'conf',
    billingAccount: '0139CF-0C97EA-F3F6D9',
    addPulumiAccessToken: true,
  },
  { providers: [flexiSoft] },
);
