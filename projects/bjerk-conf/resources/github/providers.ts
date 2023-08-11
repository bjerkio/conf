import * as github from '@pulumi/github';
import { bjerkBotGithubToken } from '../../../bjerk-io/src/stack-refs';

const githubProviders = new Map<string, github.Provider>();

const token = bjerkBotGithubToken;

export function getGithubProvider(owner: string): github.Provider {
  if (!githubProviders.has(owner)) {
    githubProviders.set(
      owner,
      new github.Provider(owner, {
        owner,
        token,
      }),
    );
  }

  const provider = githubProviders.get(owner);

  if (!provider) {
    throw new Error(`Could not find provider for ${owner}`);
  }

  return provider;
}
