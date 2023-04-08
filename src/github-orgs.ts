import * as github from '@pulumi/github';
import { githubToken as token } from './config';

export const bjerkio = new github.Provider(`bjerkio-provider`, {
  owner: 'bjerkio',
  token,
});

export const basssene = new github.Provider(`basssene-provider`, {
  owner: 'basssene',
  token,
});

export const branches = new github.Provider(`branches-provider`, {
  owner: 'getbranches',
  token,
});

export const flexiSoft = new github.Provider(`flexi-soft-provider`, {
  owner: 'flexisoftorg',
  token,
});
