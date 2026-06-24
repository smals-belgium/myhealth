export const angularConfig = [
  {
    files: ['**/*.ts'],
    rules: {
      // allow capitals for annotations
      'new-cap': 'off',
      // really stupid presentation components
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
];
