import lit from 'eslint-plugin-lit';

import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  lit.configs['flat/all'],
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['{projectRoot}/*.config.{js,cjs,mjs,ts,cts,mts}'],
          ignoredDependencies: ['@open-wc/testing'],
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
    files: ['**/*.polyfill.ts'],
    rules: {
      // it's the point of polyfills to add things that exist in the type but not in the actual (JSDOM) implementation
      // and only if the implementation doesn't exist yet, so we have to check even if the type says it exists
      '@typescript-eslint/no-unnecessary-condition': 'off',
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
