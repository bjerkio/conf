import * as github from '@pulumi/github';
import { github as config } from '../config';
import { getToken } from '../get-token';

export const provider = new github.Provider('bjerk-conf-github', {
  owner: config.owner,
  token: getToken({ type: 'github' }),
});
