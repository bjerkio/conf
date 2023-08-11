import * as github from '@pulumi/github';
import { bjerkBotGithubToken } from '../stack-refs';

export const provider = new github.Provider('github-provider', {
  token: bjerkBotGithubToken,
});
