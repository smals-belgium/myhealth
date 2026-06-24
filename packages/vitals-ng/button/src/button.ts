import { Directive, input } from '@angular/core';

// eslint-disable-next-line import/no-unassigned-import
import '@myhealth/design-kit';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: 'mh-button' })
export class Button {
  prop = input();
}
