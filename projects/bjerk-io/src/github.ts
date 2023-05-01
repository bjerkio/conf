import * as github from '@pulumi/github';
import { gitHubToken } from './stack-refs';

export const githubProvider = new github.Provider('gh-provider', {
  owner: 'bjerkio',
  token: gitHubToken,
});
