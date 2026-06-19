import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      // it's a playground; we can use the console alright
      'no-console': 'off',
    },
  },
  {
    ignores: ['**/out-tsc'],
  },
];
