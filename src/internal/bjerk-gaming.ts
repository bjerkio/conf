import * as gcp from '@pulumi/gcp';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { bjerkio } from '../github-orgs';
import { interpolate } from '@pulumi/pulumi';

export const setup = new ProjectOnGithub(
  'bjerk-gaming',
  {
    projectName: 'bjerk-gaming',
    folderId: folder.id,
    repository: 'gaming',
  },
  { providers: [bjerkio] },
);

export const ownerRole = new gcp.projects.IAMMember('bjerk-gaming-iam-cobraz', {
  member: interpolate`user:so@bjerk.io`,
  role: 'roles/owner',
  project: 'bjerk-gaming',
});

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
  'clouddebugger.googleapis.com',
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
  (service) =>
    new gcp.projects.Service(`bjerk-gaming-${service}`, {
      service,
      disableOnDestroy: false,
      project: 'bjerk-gaming',
    }),
);
