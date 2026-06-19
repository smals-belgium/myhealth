import { join } from 'path';

import { configs } from 'typescript-eslint';

/**
 * All rules that require the type checker in order to work
 */
export const typedConfig = project => [
  {
    files: ['**/*.ts'],
    ignores: [
      '**/*.spec.ts',
      '**/*.mock.ts',
      '**/test-setup.ts',
      '**/jest.config.ts',
      '**/test.ts',
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: join(process.cwd(), 'packages', project),
      },
    },
    rules: {
      ...configs.strictTypeChecked[configs.strictTypeChecked.length - 1].rules,
      '@typescript-eslint/no-confusing-void-expression': 'off',
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      // ok in a unit test: the assertion will fail anyway if the value turns out to be null
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Vite has a lot of `any` in its callbacks, so let's not get caught into having to type all of that
      '@typescript-eslint/no-unsafe-argument': 'off',
      // use this often just to check if a bound method was called; don't care about `this` then
      '@typescript-eslint/unbound-method': 'off',
    },
  },
];
