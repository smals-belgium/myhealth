import { Directive, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, RadioControlValueAccessor } from '@angular/forms';

// eslint-disable-next-line import/no-unassigned-import
import '@myhealth/design-kit';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mh-radio',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Radio),
      multi: true,
    },
  ],
  standalone: true,
  host: {
    '[attr.title]': 'title()',
    '(change)': 'onChange()',
    '(blur)': 'onTouched()',
  },
})
export class Radio extends RadioControlValueAccessor {
  readonly title = input('');
}
