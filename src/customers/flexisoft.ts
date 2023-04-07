import * as pulumi from '@pulumi/pulumi';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { flexiSoft } from '../github-orgs';

const config = new pulumi.Config('flexisoft');

export const setup = new ProjectOnGithub(
  'flexisoft',
  {
    projectName: 'flexisoft-portal',
    folderId: folder.id,
    repository: 'conf',
    billingAccount: '0139CF-0C97EA-F3F6D9',
    // TODO: Restrict access
    owners: config.requireObject<string[]>('owners'),
  },
  { providers: [flexiSoft] },
);
