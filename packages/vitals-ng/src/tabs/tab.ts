import { Directive, input } from '@angular/core';

@Directive({
  selector: 'mh-tab',
  host: {
    '[attr.label]': 'label()',
    '[attr.disabled]': 'disabled() ? "" : null',
  },
})
export class Tab {
  readonly label = input('');
  readonly disabled = input(false);
}
