import * as github from '@pulumi/github';
import { bjerkBotGitHubToken as token } from './stack-refs';

export const githubProvider = new github.Provider('gh-provider', {
  owner: 'bjerkio',
  token,
});
