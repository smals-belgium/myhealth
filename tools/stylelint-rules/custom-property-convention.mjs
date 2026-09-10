/**
 * Stylelint plugin: enforces the vitals CSS custom property naming convention.
 *
 * Convention: --mh-<component>__<category>[-<qualifier>]-[<target>][__<state>]
 *
 * Rules enforced:
 *   - All public custom property declarations must use the --mh-<component>__ prefix
 *   - The category must be one of the known categories (color, size, animation, box-shadow, z-index)
 *   - The state suffix (if present) must be separated by __ (double underscore)
 *   - Single underscores anywhere except as part of __ are forbidden
 *
 * Exemptions (not validated):
 *   - Private/internal variables: unprefixed (e.g. --radius, --thumb-size). These are
 *     scoped helpers never exposed as public API. Excluded via ignorePrefixes config.
 *   - Theme tokens in src/theme/: use the flat --mh-<concept>-<...> pattern (no __).
 *     Excluded via the separate stylelint config override for that directory.
 *   - Variant aliases in src/core/variant.css: --mh-color-<role> pattern (no __).
 *   - Cross-component overrides: a component may declare --mh-<other>__ to override a
 *     child component's variables. These are valid and pass the convention check.
 *
 * @see packages/vitals/CONTRIBUTING.md — CSS custom properties section
 */

import stylelint from 'stylelint';

const { createPlugin, utils } = stylelint;

const ruleName = 'vitals/custom-property-convention';

const messages = utils.ruleMessages(ruleName, {
  missingDoubleUnderscore: prop =>
    `Expected "${prop}" to use the component convention --mh-<component>__<category>[-qualifier]-[target][__state]. Missing "__" separator.`,
  invalidCategory: (prop, category) =>
    `Expected "${prop}" to use a valid category. Got "${category}", expected one of: color, size, animation, box-shadow, z-index.`,
  invalidState: (prop, state) =>
    `Expected state segment of "${prop}" to be kebab-case. Got "${state}".`,
  emptyCategoryBody: prop =>
    `Expected "${prop}" to have content after the category (e.g. --mh-card__size-space, not --mh-card__size).`,
  singleUnderscore: prop =>
    `Expected "${prop}" to use "__" (double underscore) as separator, not "_" (single underscore).`,
});

const meta = { url: 'https://github.com/smals-belgium/shared-myhealth' };

/**
 * Valid categories. Multi-word ones (box-shadow, z-index) are treated as atomic —
 * they map directly to the CSS property name and are never split on their internal dash.
 * Listed longest-first so prefix matching tries them before single-word categories.
 */
const ATOMIC_CATEGORIES = ['box-shadow', 'z-index'];
const SIMPLE_CATEGORIES = ['color', 'size', 'animation'];
const ALL_CATEGORIES = [...ATOMIC_CATEGORIES, ...SIMPLE_CATEGORIES];

/**
 * @param {string} prop - the full custom property name including leading --
 * @returns {boolean} true if this is a public --mh-*__ component variable
 */
function isMhComponentVar(prop) {
  return /^--mh-[a-z][a-z0-9-]+__/.test(prop);
}

/**
 * @param {string} prop - the full custom property name including leading --
 * @returns {boolean} true if this is a theme token or global alias (no __ separator)
 */
function isMhThemeToken(prop) {
  return /^--mh-[a-z]/.test(prop) && !prop.includes('__');
}

/** @type {import('stylelint').Rule} */
const rule = (primaryOption, secondaryOptions) => {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      { actual: primaryOption, possible: [true] },
      {
        actual: secondaryOptions,
        possible: {
          /** Prefixes to ignore entirely (e.g. private/internal vars). Default: all unprefixed vars are ignored. */
          ignorePrefixes: [/./],
        },
        optional: true,
      },
    );

    if (!validOptions) return;

    root.walkDecls(decl => {
      const prop = decl.prop;

      // Only inspect custom properties
      if (!prop.startsWith('--')) return;

      // Skip non-mh vars (private helpers like --radius, --thumb-size, etc.)
      if (!prop.startsWith('--mh-')) return;

      // Skip theme tokens and global aliases (--mh-color-brand-*, --mh-space-*, etc.)
      // These live in src/theme/ and src/core/variant.css and use a different pattern.
      if (isMhThemeToken(prop)) return;

      // --- From here on we're looking at a --mh-*__ component variable ---

      // Rule 1: must have __ separator
      if (!isMhComponentVar(prop)) {
        // Check if single underscore was used by mistake
        if (/^--mh-[a-z][a-z0-9-]+_[^_]/.test(prop)) {
          utils.report({
            result,
            ruleName,
            message: messages.singleUnderscore,
            messageArgs: [prop],
            node: decl,
            word: prop,
          });
        } else {
          utils.report({
            result,
            ruleName,
            message: messages.missingDoubleUnderscore,
            messageArgs: [prop],
            node: decl,
            word: prop,
          });
        }
        return;
      }

      // Extract everything after --mh-<component>__
      const afterSeparator = prop.replace(/^--mh-[a-z][a-z0-9-]+__/, '');

      // Rule 2: must not have a bare single underscore (catches --mh-foo__bar_baz).
      // Lookbehind+lookahead avoids false-positive on the second _ of a __ pair.
      if (/(?<!_)_(?!_)/.test(afterSeparator)) {
        utils.report({
          result,
          ruleName,
          message: messages.singleUnderscore,
          messageArgs: [prop],
          node: decl,
          word: prop,
        });
        return;
      }

      // Split off the state suffix (everything after a second __)
      const [categoryAndTarget, ...stateParts] = afterSeparator.split('__');
      const state = stateParts.join('__'); // allow only one state segment

      // Rule 3: identify the category.
      // Atomic categories (box-shadow, z-index) match exactly or as a prefix before a dash.
      // Simple categories (color, size, animation) are the first dash-separated token.
      const category = ALL_CATEGORIES.find(
        c => categoryAndTarget === c || categoryAndTarget.startsWith(c + '-'),
      );

      if (!category) {
        const attempted = categoryAndTarget.split('-')[0];
        utils.report({
          result,
          ruleName,
          message: messages.invalidCategory,
          messageArgs: [prop, attempted],
          node: decl,
          word: prop,
        });
        return;
      }

      // Rule 4: state segment (if present) must be kebab-case
      if (state && !/^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)*$/.test(state)) {
        utils.report({
          result,
          ruleName,
          message: messages.invalidState,
          messageArgs: [prop, state],
          node: decl,
          word: prop,
        });
      }
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
