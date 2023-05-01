import * as github from '@pulumi/github';
import { github as config } from '../config';

export const provider = new github.Provider('bjerk-conf-github', {
  owner: config.owner,
  token: config.token,
});
