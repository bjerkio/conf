import * as github from '@pulumi/github';
import { gitHubToken as token } from './stack-refs';

export const bjerkio = new github.Provider('bjerkio-provider', {
  owner: 'bjerkio',
  token,
});

export const basssene = new github.Provider('basssene-provider', {
  owner: 'basssene',
  token,
});

export const branches = new github.Provider('branches-provider', {
  owner: 'getbranches',
  token,
});

export const flexiSoft = new github.Provider('flexi-soft-provider', {
  owner: 'flexisoftorg',
  token,
});
