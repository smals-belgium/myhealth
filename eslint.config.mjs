import nx from '@nx/eslint-plugin';
import tsEslint from 'typescript-eslint';

import { importPluginConfig } from './tools/eslint-rules/import.mjs';
import { jsTsConfig } from './tools/eslint-rules/js-ts.mjs';
import { jsTsTestConfig } from './tools/eslint-rules/js-ts-test.mjs';

export default [
  {
    ignores: [
      '**/*.config.mjs',
      '**/dist',
      '**/out-tsc',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
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
