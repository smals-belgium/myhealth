import { Directive, forwardRef } from '@angular/core';
import {
  CheckboxRequiredValidator as NativeValidator,
  NG_VALIDATORS,
} from '@angular/forms';

// eslint-disable-next-line import/no-unassigned-import
import '@myhealth/design-kit';

@Directive({
  selector:
    // eslint-disable-next-line @angular-eslint/directive-selector
    'mh-checkbox[required][formControlName],mh-checkbox[required][formControl],mh-checkbox[required][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxRequiredValidator),
      multi: true,
    },
  ],
  standalone: true,
})
export class CheckboxRequiredValidator extends NativeValidator {}
