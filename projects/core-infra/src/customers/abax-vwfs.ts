import * as pulumi from '@pulumi/pulumi';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';

const config = new pulumi.Config('abax-vwfs');

export const setup = new ProjectOnGithub('abax-vwfs', {
  projectName: 'abax-vwfs-app',
  folderId: folder.id,
  owners: config.requireObject<string[]>('owners'),
});
