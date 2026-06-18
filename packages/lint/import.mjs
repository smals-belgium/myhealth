import { flatConfigs } from 'eslint-plugin-import';

import tsConfig from '../../tsconfig.base.json' with { type: 'json' };

import { setLevel } from './util.mjs';

// determine app/lib imports within an Nx workspace by reading the `paths` defined in tsconfig
const prefixes = [tsConfig]
  .map(({ compilerOptions }) => compilerOptions.paths)
  .map(Object.keys)
  .flatMap(keys => keys.map(s => s.split('/')[0]));

export const importPluginConfig = [
  {
    ...flatConfigs.recommended,
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    rules: {
      ...setLevel('error', flatConfigs.recommended.rules),
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/first': 'error',
      'import/max-dependencies': [
        'error',
        { max: 10, ignoreTypeImports: true },
      ],
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-amd': 'error',
      'import/no-commonjs': 'error',
      'import/no-cycle': 'error',
      'import/no-default-export': 'error',
      'import/no-deprecated': 'error',
      'import/no-empty-named-blocks': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-self-import': 'error',
      'import/no-unassigned-import': 'error',
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
          'newlines-between': 'always',
          pathGroups: prefixes.map(prefix => ({
            pattern: `${prefix}/**`,
            group: 'external',
            position: 'after',
          })),
        },
      ],
    },
  },
  {
    ...flatConfigs.typescript,
    files: ['**/*.ts', '**/*.tsx'],
    settings: {
      'import/resolver': {
        typescript: {
          project: 'tsconfig.base.json',
          alwaysTryTypes: true,
        },
      },
    },
  },
  // many config files of external tools work with default exports
  {
    files: ['**/*.config.ts', '**/*.config.mjs', '**/*.config.mts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  // vite is a dev dependency that the import resolver cannot find
  {
    files: ['**/*.config.mts'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },
  // test-setup and e2e support files use side-effect imports by design
  {
    files: ['**/test-setup.ts', '**/support/e2e.ts'],
    rules: {
      'import/no-unassigned-import': 'off',
    },
  },
];
