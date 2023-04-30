import * as github from '@pulumi/github';

export const githubProvider = new github.Provider('gh-provider', {
  organization: 'bjerkio',
  owner: 'bjerkio',
});
