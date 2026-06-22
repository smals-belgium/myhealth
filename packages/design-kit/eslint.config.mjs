import lit from 'eslint-plugin-lit';

import baseConfig from '../../eslint.config.mjs';
import { typedConfig } from '../../tools/eslint-rules/typed.mjs';

export default [
  ...baseConfig,
  ...typedConfig('design-kit'),
  lit.configs['flat/all'],
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
      // we're mirroring native elements (and their attributes) in many cases
      'lit/no-native-attributes': 'off',
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
    files: ['**/index.ts'],
    rules: {
      // the public barrel re-exports every component and grows with each one
      'import/max-dependencies': 'off',
    },
  },
  {
    ignores: ['**/out-tsc'],
  },
];
