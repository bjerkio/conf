import * as pulumi from '@pulumi/pulumi';

const bjerkBot = new pulumi.StackReference('Bjerk/bjerk-bot/prod');

export const bjerkBotGitHubToken = pulumi.secret(
  bjerkBot.requireOutput('gitHubToken'),
);
