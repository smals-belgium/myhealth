import nx from '@nx/eslint-plugin';
import tsEslint from 'typescript-eslint';

import { importPluginConfig } from './packages/lint/import.mjs';
import { jsTsConfig } from './packages/lint/js-ts.mjs';
import { jsTsTestConfig } from './packages/lint/js-ts-test.mjs';

export default [
  {
    ignores: [
      '**/*.config.mjs',
      '**/dist',
      '**/out-tsc',
      '**/vite.config.*.timestamp*',
    ],
  },
  ...nx.configs['flat/base'],
  ...nx.configs['flat/javascript'],
  ...nx.configs['flat/typescript'],
  ...tsEslint.configs.strict,
  ...jsTsConfig,
  ...jsTsTestConfig,
  ...importPluginConfig,
];
