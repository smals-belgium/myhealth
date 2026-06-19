import baseConfig from '../../eslint.config.mjs';
import { typedConfig } from '../../packages/lint/typed.mjs';

export default [
  ...baseConfig,
  ...typedConfig('design-kit'),
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
    files: ['**/*.ts'],
    rules: {
      // allow Lit lifecycle hooks that don't access state
      'class-methods-use-this': ['error', { exceptMethods: ['render'] }],
      // this is how Lit works: methods referenced from templates are correctly bound
      '@typescript-eslint/unbound-method': 'off',
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
