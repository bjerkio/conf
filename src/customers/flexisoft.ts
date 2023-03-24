import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { basssene, flexiSoft } from '../github-orgs';

export const setup = new ProjectOnGithub(
  'flexisoft',
  {
    projectName: 'flexisoft-portal',
    folderId: folder.id,
    repository: 'conf',
  },
  { providers: [flexiSoft] },
);

export const dnsRole = new gcp.projects.IAMMember(
  'flexisoft-dns-iam',
  {
    member: pulumi.interpolate`serviceAccount:${setup.serviceAccount.email}`,
    role: 'roles/owner',
  },
  { provider: setup.googleProvider },
);
