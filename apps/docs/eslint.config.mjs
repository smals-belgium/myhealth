import baseConfig from '../../eslint.config.mjs';
import { jsTsConfig } from '../../tools/eslint-rules/js-ts.mjs';
import { setLevel } from '../../tools/eslint-rules/util.mjs';

export default [
  ...baseConfig,
  // revert back from strict for now
  { ...jsTsConfig[0], rules: setLevel('warn', jsTsConfig[0].rules) },
  {
    files: ['**/_data/*.mjs'],
    rules: {
      // Eleventy convention-based imports
      'import/no-default-export': 'off',
    },
  },
];
