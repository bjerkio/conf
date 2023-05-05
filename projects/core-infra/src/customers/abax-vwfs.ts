import * as pulumi from '@pulumi/pulumi';
import { isFuture } from 'date-fns';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';

const config = new pulumi.Config('abax-vwfs');

export const setup = new ProjectOnGithub('abax-vwfs', {
  projectName: 'abax-vwfs-app',
  folderId: folder.id,
  owners:
    // If the current date is before 2023-05-12, then use the owners from the config,
    // if not remove them.
    //
    // We only give owner access for a limited time for security reasons.
    isFuture(new Date('2023-05-12'))
      ? config.requireObject<string[]>('owners')
      : [],
});
