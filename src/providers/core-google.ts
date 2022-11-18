import * as gcp from '@pulumi/gcp';
import { coreProject } from '../config';

export const provider = new gcp.Provider(
  'bjerk-core-google',
  {
    project: coreProject,
  },
  { parent: this },
);
