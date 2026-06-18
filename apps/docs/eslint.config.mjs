import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/_data/*.mjs'],
    rules: {
      // Eleventy convention-based imports
      'import/no-default-export': 'off',
    },
  },
];
