import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { basssene, flexiSoft } from '../github-orgs';
import { developers } from '../config';

export const setup = new ProjectOnGithub(
  'flexisoft',
  {
    projectName: 'flexisoft-portal',
    folderId: folder.id,
    repository: 'conf',
    // TODO: Restrict access
    owners: developers,
  },
  { providers: [flexiSoft] },
);
