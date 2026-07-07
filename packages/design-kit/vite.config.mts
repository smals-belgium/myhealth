/// <reference types='vitest' />
import * as path from 'path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/design-kit',
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
    }),
    // Copy static assets (font files) plus package metadata into the published
    // dist so consumers can access fonts under `@smals-belgium-shared/vitals/assets/*`.
    viteStaticCopy({
      targets: [
        { src: 'assets/fonts', dest: '.' },
        // this is a bit strange, but because the source file is outside the projectRoot
        // we have to cd back into the outDir from the projectRoot...
        { src: '../../LICENSE.md', dest: './dist/' },
      ],
    }),
  ],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: {
        index: 'src/index.ts',
        'core/index': 'src/core/index.ts',
        'button/index': 'src/button/index.ts',
        'callout/index': 'src/callout/index.ts',
        'card/index': 'src/card/index.ts',
        'checkbox/index': 'src/checkbox/index.ts',
        'chip/index': 'src/chip/index.ts',
        'dialog/index': 'src/dialog/index.ts',
        'divider/index': 'src/divider/index.ts',
        'icon/index': 'src/icon/index.ts',
        'icon-button/index': 'src/icon-button/index.ts',
        'radio/index': 'src/radio/index.ts',
        'select/index': 'src/select/index.ts',
        'skeleton/index': 'src/skeleton/index.ts',
        'slide-toggle/index': 'src/slide-toggle/index.ts',
        'snackbar/index': 'src/snackbar/index.ts',
        'spinner/index': 'src/spinner/index.ts',
        'table/index': 'src/table/index.ts',
        'testing/index': 'src/testing/index.ts',
        'text-input/index': 'src/text-input/index.ts',
        'tooltip/index': 'src/tooltip/index.ts',
      },
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es' as const],
    },
    rolldownOptions: {
      // External packages that should not be bundled into your library.
      external: [/^lit/, /^@lit\//, /^@lit-labs\//, /^@open-wc\/testing/],
    },
  },
  test: {
    name: '@myhealth/design-kit',
    watch: false,
    globals: true,
    css: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
