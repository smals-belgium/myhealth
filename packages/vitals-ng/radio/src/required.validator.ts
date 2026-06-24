import { Directive, forwardRef, OnChanges } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

// eslint-disable-next-line import/no-unassigned-import
import '@myhealth/design-kit';

@Directive({
  selector:
    // eslint-disable-next-line @angular-eslint/directive-selector
    '[required][formControlName],[required][formControl],mh-radio[required][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RequiredValidator),
      multi: true,
    },
  ],
  standalone: true,
})
export class RequiredValidator implements Validator, OnChanges {
  private _onChange = () => {};

  ngOnChanges() {
    this._onChange();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    console.log(control);
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this._onChange = fn;
  }
}
