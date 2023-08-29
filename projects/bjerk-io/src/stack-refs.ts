import * as pulumi from '@pulumi/pulumi';

// const bjerkBot = new pulumi.StackReference('bjerk/bjerk-bot/prod');

// export const bjerkBotGitHubToken = pulumi.secret(
//   bjerkBot.requireOutput('gitHubToken'),
// );

const config = new pulumi.Config();
export const bjerkBotGitHubToken = config.requireSecret('temp-github-token');
