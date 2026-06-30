import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { version } from '@myhealth/vitals-ng';
import { BUTTON } from '@myhealth/vitals-ng/button';

@Component({
  imports: [FormsModule, BUTTON],
  templateUrl: './form-sandbox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSandbox {
  readonly version = version;
}
