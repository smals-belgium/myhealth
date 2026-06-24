import { Directive, forwardRef, input } from '@angular/core';
import {
  CheckboxControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

// eslint-disable-next-line import/no-unassigned-import
import '@myhealth/design-kit';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mh-checkbox',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true,
    },
  ],
  standalone: true,
  host: {
    '[attr.title]': 'title()',
    '[attr.indeterminate]': 'indeterminate() ? "" : null',
    '(change)': 'onChange($any($event.target).checked)',
    '(blur)': 'onTouched()',
  },
})
export class Checkbox extends CheckboxControlValueAccessor {
  readonly title = input('');
  readonly indeterminate = input(false);
}
