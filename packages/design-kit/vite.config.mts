/// <reference types='vitest' />
import * as path from 'path';

import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/design-kit',
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
    }),
    // Copy static assets (font files) plus package metadata into the published
    // dist so consumers can access fonts under `@myhealth/design-kit/assets/*`.
    nxCopyAssetsPlugin([
      { input: 'assets/fonts', glob: '**/*', output: 'assets/fonts' },
    ]),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  // Configuration for building your library.
  // See: https://vite.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: {
        'button/index': 'src/button/index.ts',
        'card/index': 'src/card/index.ts',
        'checkbox/index': 'src/checkbox/index.ts',
        'dialog/index': 'src/dialog/index.ts',
        'divider/index': 'src/divider/index.ts',
        'icon/index': 'src/icon/index.ts',
        'icon-button/index': 'src/icon-button/index.ts',
        'radio/index': 'src/radio/index.ts',
        'skeleton/index': 'src/skeleton/index.ts',
        'snackbar/index': 'src/snackbar/index.ts',
        'spinner/index': 'src/spinner/index.ts',
        'text-input/index': 'src/text-input/index.ts',
      },
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es' as const],
    },
    rolldownOptions: {
      // External packages that should not be bundled into your library.
      external: [/^lit/, /^@lit\//, /^@lit-labs\//],
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
