import * as gcp from '@pulumi/gcp';
import { Config } from '@pulumi/pulumi';
import { ProjectOnGithub } from '../components/projects-on-github';
import { developers } from '../config';
import { ProjectSlackLogger } from '../slack-logger';
import { folder } from './folder';
import { getGithubProvider } from '../providers/github';

const bjerkio = getGithubProvider('bjerkio');

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
  {
    channel: config.require('slack-channel'),
    projectId: setup.project.projectId,
  },
  { provider: setup.googleProvider },
);

developers.map(developer => {
  new gcp.projects.IAMMember(
    `timely-agent-${developer}-private-logs-viewer`,
    {
      member: developer,
      role: 'roles/logging.privateLogViewer',
      project: setup.project.projectId,
    },
    { provider: setup.googleProvider },
  );
  new gcp.projects.IAMMember(
    `timely-agent-${developer}-cloud-run-viewer`,
    {
      member: developer,
      role: 'roles/run.viewer',
      project: setup.project.projectId,
    },
    { provider: setup.googleProvider },
  );
});
