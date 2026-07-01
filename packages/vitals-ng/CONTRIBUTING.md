# Contributing to vitals-ng

## Creating Angular component wrappers

Three simple steps:

- [Generate a secondary entrypoint](#generate-a-secondary-entrypoint)
- [Create the Angular wrapper component](#create-the-angular-wrapper-component)
- [Edit the index file](#edit-the-index-file)

### Generate a secondary entrypoint

```sh
npx nx g @nx/angular:library-secondary-entry-point --library=vitals-ng --name=my-component
```

Delete the generated `my-component/src/lib` directory. As of Nx 23 it still generates `NgModule`.

### Create the Angular wrapper component

Pay attention to mirror all Lit component attributes as Angular inputs.

```ts
import { Directive, input } from '@angular/core';

import type { MyComponentVariant } from '@myhealth/design-kit/my-component';

@Directive({
  selector: 'mh-my-component',
  host: {
    '[attr.variant]': 'variant()',
  },
})
export class MyComponent {
  readonly variant = input<MyComponentVariant>('my-variant');
}
```

**Extra attention point:** required inputs.  
Lit component attributes/properties cannot be made required at compile time, but Angular inputs can.
So consider this, and make them required where needed.

**Boolean attributes** can't be bound directly like string values, because these attributes are either present or
not present, without an actual value. Example binding of a boolean attribute:

```ts
@Directive({
  host: {
    '[attr.disabled]': 'disabled() ? "" : null',
  },
})
export class MyComponent {
  readonly disabled = input(false);
}
```

### Edit the index file

- Import the corresponding Lit secondary entry-point
- Re-export all Angular artifacts needed for this component
- Export an imports array that contains everything needed for a component to work

In its simplest form it will look like this:

```ts
import '@myhealth/design-kit/my-component';

import { MyComponent } from './my-component';

export * from './my-component';

export const MY_COMPONENT = [MyComponent];
```

But let's imagine a form component with some custom validator directives:

```ts
import '@myhealth/design-kit/my-form-component';

import { MyFormComponent } from './my-form-component';
import { MyValidator } from './my-validator';

export * from './my-form-component';
export * from './my-validator';

export const MY_FORM_COMPONENT = [MyFormComponent, MyValidator];
```

## Running unit tests

Run `nx test vitals-ng` to execute the unit tests.
