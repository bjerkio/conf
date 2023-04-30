import * as pulumi from '@pulumi/pulumi';
import { ProjectOnGithub } from '../components/projects-on-github';
import { flexiSoft } from '../github-orgs';
import { folder } from './folder';

const config = new pulumi.Config('flexisoft');

export const setup = new ProjectOnGithub(
  'flexisoft',
  {
    projectName: 'flexisoft-app',
    folderId: folder.id,
    repository: 'conf',
    billingAccount: '0139CF-0C97EA-F3F6D9',
    // TODO: Restrict access
    owners: config.requireObject<string[]>('owners'),
    addPulumiAccessToken: true,
  },
  { providers: [flexiSoft] },
);
