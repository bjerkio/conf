import * as github from '@pulumi/github';

export const bjerkio = new github.Provider(`bjerkio-provider`, {
  owner: 'bjerkio',
});

export const basssene = new github.Provider(`basssene-provider`, {
  owner: 'basssene',
});

export const branches = new github.Provider(`branches-provider`, {
  owner: 'getbranches',
});

export const flexiSoft = new github.Provider(`flexi-soft-provider`, {
  owner: 'flexisoftorg',
})
