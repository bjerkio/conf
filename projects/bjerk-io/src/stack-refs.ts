import * as pulumi from '@pulumi/pulumi';

const bjerkBotStack = new pulumi.StackReference('Bjerk/bjerk-bot/prod');

export const bjerkBotGitHubToken = pulumi.secret(
  bjerkBotStack.requireOutput('githubToken'),
);
