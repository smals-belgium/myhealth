# vitals-ng

Angular wrapper components for the Lit Vitals web component library.

## Usage

### Install dependency

```sh
npm install @myhealth/vitals-ng
```

### Add theme

Include a theme stylesheet. The most idiomatic Angular approach to this is to

- either import it in the global stylesheet
- or add it to the `styles` array in the app build target

#### Importing in global stylesheet

```scss
// my-app/src/styles.scss
@forward '@myhealth/design-kit/dist/my-health.css';
```

#### Build target stylesheet

```json
// angular.json or project.json
"build": {
  "executor": "@angular/build:application",
  "options": {
    "styles": [
      "my-app/src/styles.scss",
      "node_modules/@myhealth/design-kit/dist/my-health.css"
    ]
  },
```

### Use components

Same as with any other component library.
Note that all components are standalone and are accessible through a secondary entrypoint.

```ts
import { Component } from '@angular/core';
import { BUTTON } from '@myhealth/vitals-ng/button';

@Component({
  imports: [BUTTON],
  template: '<mh-button>click me</mh-button>',
})
export class MyComponent {}
```

### Customizing

#### Global theme customisations

#### Local tweaks
