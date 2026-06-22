import js from '@eslint/js';
import globals from 'globals';

const jsRules = {
  ...js.configs.all.rules,
  'capitalized-comments': [
    'error',
    'always',
    { ignoreConsecutiveComments: true },
  ],
  curly: ['error', 'multi'],
  'no-case-declarations': 'off',
  'no-magic-numbers': ['error', { ignore: [0, 1, 2, 10] }],
  'no-multi-assign': 'off',
  'no-ternary': 'off',
  'one-var': 'off',
  'sort-keys': 'off',
};

const tsRules = {
  '@typescript-eslint/array-type': 'error',
  '@typescript-eslint/no-unused-expressions': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
    },
  ],
};

const nxRules = {
  '@nx/enforce-module-boundaries': [
    'error',
    {
      enforceBuildableLibDependency: true,
      allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
      depConstraints: [
        {
          sourceTag: 'type:app',
          onlyDependOnLibsWithTags: ['type:dk', 'type:util'],
        },
        {
          sourceTag: 'type:e2e',
          onlyDependOnLibsWithTags: ['type:e2e', 'type:util'],
        },
        {
          sourceTag: 'type:dk',
          onlyDependOnLibsWithTags: ['type:dk', 'type:util'],
        },
        {
          sourceTag: 'type:util',
          onlyDependOnLibsWithTags: ['type:util'],
        },
      ],
    },
  ],
};

export const jsTsConfig = [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...jsRules,
      ...tsRules,
      ...nxRules,
    },
  },
];
