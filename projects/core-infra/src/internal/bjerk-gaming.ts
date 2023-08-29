import * as gcp from '@pulumi/gcp';
import { ProjectOnGithub } from '../components/projects-on-github';
import { bjerkio } from '../github-orgs';
import { folder } from './folder';

export const setup = new ProjectOnGithub(
  'bjerk-gaming',
  {
    projectName: 'bjerk-gaming',
    folderId: folder.id,
    repository: 'gaming',
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
];

export const apiServices = services.map(
  service =>
    new gcp.projects.Service(`bjerk-gaming-${service}`, {
      service,
      disableOnDestroy: false,
      project: 'bjerk-gaming',
    }),
);
