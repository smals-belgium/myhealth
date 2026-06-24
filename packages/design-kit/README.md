# design-kit

### Design System

Based on the MyHealth Global Design System, this a UI component library based on [Lit](https://lit.dev/).
DS Figma: https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System

### Tool chain

- Vite for bundling
- Vitest for unit testing

### Core technologies

- [Web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [Lit](https://lit.dev/)
- [Open web components testing package](https://open-wc.org/docs/testing/testing-package/)

### Get started

```sh
git clone git@github.com:smals-belgium/myhealth.git
npm install
npm start
```

Will start a Vite dev server with a sandbox application to test the MyHealth components.

`nx run @myhealth/design-kit:serve`: Serve the component sandbox app  
`nx run @myhealth/design-kit:test`: Run unit tests  
`nx run @myhealth/design-kit:build`: Build and bundle

### Adding icons

- Add an svg file to the `./src/icon/svg/` dir
- The file name is used as the `mh-icon` name property, so double check it
- Make sure all svg `path`s have `fill="currentColor"`, otherwise CSS color will not affect the icon
- Preferred box size is 24x24

Currently we use Material icons for backwards compatibility.  
SVGs can be downloaded from https://fonts.google.com/icons

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

### Writing components

All components are located directly under the design kit's `src` directory in a flat structure.  
Each component has a dedicated directory.

```
design-kit/
|- src/
    |- component-a/
    |- component-b/
```

There may be an exception to this rule if there are more variations of the same component.  
i.e. two components that have to be registered separately, but share a vast majority of functionality.

Otherwise a simple component will follow this base file structure:

```
my-component
|- index.ts
|- my-component.css
|- my-component.spec.ts
|- my-component.ts
```

The index file is what will be publicly accessible to users of the DK.  
Typically you'll just export the component and register the component's tag name in the DOM type system.

```ts
import type { MyComponent } from './my-component';

export * from './my-component';

declare global {
  interface HTMLElementTagNameMap {
    'mh-my-component': MyComponent;
  }
}
```

The split between component, styles and unit tests is self-explanatory.  
However, the CSS file can be further broken down:

- if a component has visual variations (appearances, loudnesses, sizes, etc.) these should go into dedicated files
  whose extension is `.<variation>.css`
- if a component overrides the styles of projected other components, these should go into dedicated files whose
  extension is `-<slot-name>.slot.css`
- if a component has a lot of css variables, they can go into a dedicated file with extension `.vars.css`

So the most extensive example would look something like:

```
my-component
|- my-component.css
|- my-component-icon.slot.css
|- my-component-checkbox.slot.css
|- my-component.appearance.css
|- my-component.size.css
|- my-component.vars.css
```

### Events

### Error handling

### Internationalisation (i18n)

### Accesibility (a11y)

### Testing
