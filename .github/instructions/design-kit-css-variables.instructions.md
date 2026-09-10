---
applyTo: 'packages/vitals/**'
description: 'CSS custom property naming convention for vitals components.'
---

# CSS Custom Property Naming Convention

All CSS custom properties exposed by `packages/vitals` components follow this pattern:

```
--mh-<component>__<category>[-<qualifier>]-[<target>][__<state>]
```

## Segments

- **`mh`** — global prefix, always present
- **`component`** — element tag without `mh-` prefix (e.g. `text-input`, `icon-button`)
- **`category`** — the CSS concept: `color`, `size`, `animation`, `box-shadow`, `z-index`
- **`qualifier`** _(optional)_ — narrows the category (e.g. `fill`, `border`, `width`). **Qualifier comes before target.**
- **`target`** _(optional)_ — sub-element being styled. **Omit when the variable applies to the host element itself.**
- **`state`** _(optional)_ — interactive/validation state (`hover`, `focus`, `active`, `disabled`, `invalid`). Multiple states combined with a single dash: `invalid-hover`, `invalid-focus`. **Always separated by `__` (double underscore).**

## Categories

| Category | Used for |
|---|---|
| `color` | Any color value — use qualifier `fill` (background), `type` (foreground/text), `border`, `icon`, etc. |
| `size` | Dimensions, spacing, radii, offsets — use qualifier `space` for multi-purpose spacing, specific names otherwise |
| `animation` | Timing, duration, easing |
| `box-shadow` | Shadow shorthand (CSS property name used verbatim) |
| `z-index` | Stacking order (CSS property name used verbatim) |

## Key rules

1. **Omit target when host.** `--mh-card__size-space` (host spacing) vs `--mh-text-input__color-border-input` (targets the `input` child).
2. **Qualifier before target.** `size-width-track` ✅, `size-track-width` ❌.
3. **State uses `__` double underscore.** `--mh-button__color-fill__hover`.
4. **Single underscore is never valid.** Only `-` within segments and `__` between component/rest and before state.
5. **`color-type` = text/foreground color** per design token convention.
6. **`color-fill` = background color.**
7. **Multi-purpose spacing = `size-space`.** Single-axis/element dimensions get specific names: `size-height`, `size-width`, `size-inset`.
8. **`animation` for all timing values** — never use `size` for durations or easing.
9. **`box-shadow` and `z-index` are used verbatim as categories** — no qualifier or target needed.

## @cssproperty annotations (required)

Every public CSS variable must have a `@cssproperty` annotation in the component TypeScript file:

```ts
// With a single concrete default:
@cssproperty [--mh-card__size-space=var(--mh-space-m)] - The spacing around and between sections of the card.

// When default varies (e.g. per loudness):
@cssproperty --mh-icon-button__color-fill - The background color. Defaults vary by loudness.
```

Internal calculation helpers (`--radius`, `--circumference`, etc.) are **not** public API — do not annotate them.

## Quick examples

```
✅  --mh-text-input__color-border-input__invalid
✅  --mh-spinner__size-width-track
✅  --mh-spinner__animation-speed
✅  --mh-dialog__box-shadow
✅  --mh-card__size-space

❌  --spacing                         (no prefix or component)
❌  --mh-card__space                  (missing category)
❌  --mh-spinner__size-track-width    (target before qualifier)
❌  --mh-text-input_color-border      (single underscore)
```
