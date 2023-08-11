import * as pulumi from '@pulumi/pulumi';

const bjerkBot = new pulumi.StackReference('Bjerk/bjerk-bot/prod');

export const bjerkBotGithubToken = pulumi.secret(
  bjerkBot.requireOutput('gitHubToken'),
);
