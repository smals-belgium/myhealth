const jsRules = {
  // allow capitals for annotations
  'new-cap': 'off',
};

const tsRules = {};

export const angularConfig = [
  {
    files: ['**/*.ts'],
    rules: {
      ...jsRules,
      ...tsRules,
    },
  },
];
