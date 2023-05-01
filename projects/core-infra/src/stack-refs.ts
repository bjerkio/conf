import * as pulumi from '@pulumi/pulumi';

const bjerkConf = new pulumi.StackReference('Bjerk/bjerk-conf/prod');

export const gitHubToken = pulumi.secret(
  bjerkConf.requireOutput('gitHubToken'),
);
