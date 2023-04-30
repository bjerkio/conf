import * as gcp from '@pulumi/gcp';
import { google } from '../config';

export const provider = new gcp.Provider(
  'bjerk-core-google',
  {
    project: google.projectId,
  }
);
