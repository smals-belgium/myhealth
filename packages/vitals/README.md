# Vitals

### Design System

Based on the MyHealth Global Design System, this a UI component library based on [Lit](https://lit.dev/).
DS Figma: https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System

[Look here if you want to contribute](./CONTRIBUTING.md)

### Global theme (tokens, fonts, base styles)

The package exposes a single official global stylesheet entrypoint:

`@smals-belgium-shared/vitals/theme.css`

This file includes:

- global design tokens (`--mh-*`)
- bundled `@font-face` declarations (Open Sans)
- essential base global styles used by the design system

#### Angular

For integration examples (Angular `build.options.styles`, SCSS `@forward`), see the [vitals-ng README](../vitals-ng/README.md#add-theme).

#### Other contexts (Vite, Webpack, plain CSS)

Import the stylesheet once from your app entrypoint or global stylesheet:

```css
@import '@smals-belgium-shared/vitals/theme.css';
```

Or from JavaScript/TypeScript:

```ts
import '@smals-belgium-shared/vitals/theme.css';
```

### Using your own font

The kit ships with [Open Sans](https://fonts.google.com/specimen/Open+Sans) self-hosted as the default
typeface. Text is rendered with the `--mh-font-family` token, so you can swap the typeface without
touching component styles.

Declare your own `@font-face` (or reference a font your app already loads), then override the token on
`:root` (or any scope):

```css
@font-face {
  font-family: 'Acme Sans';
  src: url('/fonts/acme-sans.woff2') format('woff2');
}

:root {
  --mh-font-family: 'Acme Sans', sans-serif;
}
```

The bundled Open Sans `@font-face` rules stay inert when unused — a browser only downloads a font once
rendered text references that family — so overriding the token incurs no extra Open Sans download.

### Nomenclature

- **appearance**: different variations of how the component looks; these can depend on the component, so one
  component could have `'plain' | 'outlined'` while another has `'square' | 'round'`
- **[loudness](./src/core/loudness.ts)**: mostly applies to the component's color scheme, but more generically
  determines how loud or present a component is; akin to Bootstrap's (darker, dark, ...), loudness ranges from `loudest`
  to `quietest`, but is more flexible in different contexts (for example `loudest` could mean a very light component
  color in a dark theme or background) and can apply to other parameters like border thickness. The full range has 5
  loudnesses, but a component may only implement a subset of these.
- **[size](./src/core/size.ts)**: determines the visual size of the component and uses t-shirt sizes ranging from
  `xs` to `xl`. The full range is 5 sizes, but a component may only implement a subset of these.
- **[orientation](./src/core/orientation.ts)**: determines horizontal or vertical layout of a component
