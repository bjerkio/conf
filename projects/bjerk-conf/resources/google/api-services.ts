import * as gcp from '@pulumi/gcp';
import { provider } from './provider';

export const services = [
  'servicemanagement.googleapis.com',
  'servicecontrol.googleapis.com',
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
  'iam.googleapis.com',
  'cloudbilling.googleapis.com',
  'iamcredentials.googleapis.com',
];

export const apiServices = services.map(
  service =>
    new gcp.projects.Service(
      service,
      {
        service,
        disableOnDestroy: false,
        project: 'bjerk-conf',
      },
      { provider },
    ),
);
