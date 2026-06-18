import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/vite.config.{js,ts,mjs,mts}',
            '{projectRoot}/custom-elements-manifest.config.{js,cjs,mjs,ts,cts,mts}',
          ],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      // need to import self-registering web components in their respective unit tests
      'import/no-unassigned-import': 'off',
    },
  },
  {
    ignores: ['**/out-tsc'],
  },
];
