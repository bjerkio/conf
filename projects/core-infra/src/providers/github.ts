import * as github from '@pulumi/github';
import { bjerkBotGitHubToken } from '../stack-refs';

export const provider = new github.Provider('github-provider', {
  token: bjerkBotGitHubToken,
});
