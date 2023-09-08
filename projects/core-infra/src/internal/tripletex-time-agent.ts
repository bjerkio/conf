import * as gcp from '@pulumi/gcp';
import { Config } from '@pulumi/pulumi';
import { ProjectOnGithub } from '../components/projects-on-github';
import { bjerkio } from '../github-orgs';
import { ProjectSlackLogger } from '../slack-logger';
import { folder } from './folder';

const config = new Config('behalf');

export const setup = new ProjectOnGithub(
  'behalf',
  {
    projectName: 'behalf',
    folderId: folder.id,
    repositories: ['behalf'],
  },
  { providers: [bjerkio] },
);

export const services = [
  'servicemanagement.googleapis.com',
  'servicecontrol.googleapis.com',
  'container.googleapis.com',
  'compute.googleapis.com',
  'dns.googleapis.com',
  'cloudresourcemanager.googleapis.com',
  'logging.googleapis.com',
  'stackdriver.googleapis.com',
  'monitoring.googleapis.com',
  'cloudtrace.googleapis.com',
  'clouderrorreporting.googleapis.com',
  'cloudprofiler.googleapis.com',
  'sqladmin.googleapis.com',
  'cloudkms.googleapis.com',
  'cloudfunctions.googleapis.com',
  'run.googleapis.com',
  'cloudbuild.googleapis.com',
  'iam.googleapis.com',
  'cloudbilling.googleapis.com',
  'eventarc.googleapis.com',
];

export const apiServices = services.map(
  service =>
    new gcp.projects.Service(
      `tta-${service}`,
      {
        service,
        disableOnDestroy: false,
        project: 'behalf',
      },
      { dependsOn: setup },
    ),
);

new ProjectSlackLogger(
  'behalf',
  {
    channel: config.require('slack-channel'),
    projectId: setup.project.projectId,
  },
  { provider: setup.googleProvider, dependsOn: apiServices },
);
