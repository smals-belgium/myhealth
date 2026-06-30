import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';
import { angularConfig } from '../../tools/eslint-rules/angular.mjs';

export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...baseConfig,
  ...angularConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['{projectRoot}/*.config.{js,cjs,mjs,ts,cts,mts}'],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/index.ts'],
    rules: {
      // allow Lit component imports from entry points only
      'import/no-unassigned-import': 'off',
    },
  },
];
