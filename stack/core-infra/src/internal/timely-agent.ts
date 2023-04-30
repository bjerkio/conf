import { Config } from '@pulumi/pulumi';
import { ProjectOnGithub } from '../components/projects-on-github';
import { bjerkio } from '../github-orgs';
import { ProjectSlackLogger } from '../slack-logger';
import { folder } from './folder';

const config = new Config('timely-agent');

export const setup = new ProjectOnGithub(
  'timely-agent',
  {
    projectName: 'timely-agent',
    folderId: folder.id,
    repositories: ['timely-agent', 'timely-app'],
  },
  { providers: [bjerkio] },
);

new ProjectSlackLogger(
  'timely-agent',
  { channel: config.require('slack-channel') },
  { provider: setup.googleProvider },
);
