import { getToken } from './get-token';

export const github = {
  owner: 'bjerkio',
  repo: 'conf',
  token: getToken({ type: 'github' }),
};

export const google = {
  projectId: 'bjerk-conf',
};

export const organizationNumber = 904377566042;
