// @ts-check
/**
 * Stylelint configuration for packages/vitals.
 *
 * Two distinct rule sets are applied via overrides:
 *
 * 1. Component files (src/<component>/**): enforce the full --mh-<component>__<category>
 *    naming convention via the custom plugin.
 *
 * 2. Theme/core/global files: only enforce baseline syntax rules — they use the flat
 *    --mh-<concept>-<...> token pattern which does not follow the component convention.
 */

/** @type {import('stylelint').Config} */
export default {
  plugins: ['../../tools/stylelint-rules/custom-property-convention.mjs'],

  extends: ['stylelint-config-standard'],

  rules: {
    // Disable the built-in pattern rule — our plugin handles component vars more precisely.
    'custom-property-pattern': null,

    // Lit CSS-in-JS uses `unsafeCSS` and tagged templates — no import/url checks needed.
    'import-notation': null,

    // allow appearance prefixes for older browsers
    'property-no-vendor-prefix': [
      true,
      { ignoreProperties: ['/^.*-appearance$/'] },
    ],

    // Component CSS deliberately places state/modifier selectors after base selectors.
    // The resulting specificity ordering is intentional, not a bug.
    'no-descending-specificity': null,

    // Allow empty lines between declarations to visually group related properties
    // (e.g. all color vars together, then a blank line, then sizing vars).
    'declaration-empty-line-before': null,
    'custom-property-empty-line-before': null,
  },

  overrides: [
    {
      // Component source files: enforce the naming convention.
      files: ['src/**/*.css'],
      rules: {
        'vitals/custom-property-convention': true,
      },
    },
    {
      // Theme, core and global files use the flat --mh-<token> pattern — skip convention check.
      files: [
        'src/theme/**/*.css',
        'src/core/**/*.css',
        'src/global/**/*.css',
        'src/theme.css',
      ],
      rules: {
        'vitals/custom-property-convention': null,
      },
    },
  ],
};
