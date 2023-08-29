import * as github from '@pulumi/github';
import * as pulumi from '@pulumi/pulumi';
import { bjerkBotGitHubToken } from './stack-refs';

export const githubProvider = new github.Provider('gh-provider', {
  owner: 'bjerkio',
  token: bjerkBotGitHubToken,
});
