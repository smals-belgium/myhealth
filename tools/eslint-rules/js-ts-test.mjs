import globals from 'globals';

const jsRules = {
  // describe's can be huge
  'max-lines': 'off',
  'max-lines-per-function': 'off',
  'max-statements': 'off',
  // test specific values
  'no-magic-numbers': 'off',
};

const tsRules = {};

export const jsTsTestConfig = [
  {
    files: ['**/*.spec.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
    rules: {
      ...jsRules,
      ...tsRules,
    },
  },
];
