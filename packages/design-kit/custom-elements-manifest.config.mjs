import { getTsProgram, typeParserPlugin } from '@wc-toolkit/type-parser';

export default {
  globs: ['src/**/*.ts'],
  exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
  outdir: '.',
  litelement: true,

  overrideModuleCreation({ ts, globs }) {
    const program = getTsProgram(ts, globs, 'tsconfig.lib.json');
    return program
      .getSourceFiles()
      .filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
  },

  plugins: [typeParserPlugin()],
};
