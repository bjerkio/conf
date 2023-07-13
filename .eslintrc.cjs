module.exports = {
  extends: ['@bjerk/eslint-config'],
  rules: {
    'import/no-unassigned-import': 'off',
  },
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};
