import * as github from '@pulumi/github';
import * as pulumi from '@pulumi/pulumi';

const githubProviders = new Map<string, github.Provider>();

const config = new pulumi.Config();

export function getGithubProvider(owner: string): github.Provider {
  if (!githubProviders.has(owner)) {
    githubProviders.set(
      owner,
      new github.Provider(owner, {
        owner,
        token: config.requireSecret('github:token'),
      }),
    );
  }

  const provider = githubProviders.get(owner);

  if (!provider) {
    throw new Error(`Could not find provider for ${owner}`);
  }

  return provider;
}
