import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RADIO } from '@myhealth/vitals-ng/radio';

import { BUTTON } from '@myhealth/vitals-ng/button';
import { CHECKBOX } from '@myhealth/vitals-ng/checkbox';

const formErrors = (form: NgForm) =>
  Object.keys(form.controls).reduce(
    (errors, key) =>
      form.controls[key].errors
        ? {
            ...errors,
            [key]: form.controls[key].errors,
          }
        : errors,
    {},
  );

@Component({
  imports: [FormsModule, JsonPipe, BUTTON, CHECKBOX, RADIO],
  template: `
    <form #form="ngForm">
      <mh-checkbox
        #cb="ngModel"
        name="cb"
        ngModel
        required
        >check</mh-checkbox
      >

      <br />
      Checkbox value {{ cb.value }}<br />
      Checkbox valid {{ cb.valid }}<br />

      <mh-radio
        name="gender"
        value="m"
        ngModel
        required
        >male</mh-radio
      >
      <mh-radio
        name="gender"
        value="f"
        ngModel
        required
        >female</mh-radio
      >

      <input
        type="radio"
        name="g"
        value="f"
        ngModel
        required
      />
      <input
        type="radio"
        name="g"
        value="m"
        ngModel
      />

      <br />
      Form value {{ form.value | json }}<br />
      Form valid {{ form.valid }}<br />
      Form errors {{ errors(form) | json }}

      <footer>
        <mh-button
          type="submit"
          [disabled]="!form.valid"
          >Submit</mh-button
        >
        <mh-button
          type="reset"
          appearance="outlined"
          >Reset</mh-button
        >
      </footer>

      <mh-a
        href="https://github.com/smals-belgium/myhealth"
        appearance="link"
        >Source code</mh-a
      >
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSandbox {
  readonly errors = formErrors;
}
