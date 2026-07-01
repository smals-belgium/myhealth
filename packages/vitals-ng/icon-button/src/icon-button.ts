import { Directive, input } from '@angular/core';

import type {
  IconButtonAppearance,
  IconButtonLoudness,
} from '@myhealth/design-kit/icon-button';

@Directive({
  selector: 'mh-icon-button',
  host: {
    '[attr.title]': 'title()',
    '[attr.label]': 'label()',
    '[attr.name]': 'name()',
    '[attr.appearance]': 'appearance()',
    '[attr.loudness]': 'loudness()',
    '[attr.disabled]': 'disabled() ? "" : null',
  },
})
export class IconButton {
  readonly title = input('');
  readonly label = input<string>();
  readonly name = input.required<string>();
  readonly appearance = input<IconButtonAppearance>('round');
  readonly loudness = input<IconButtonLoudness>('normal');
  readonly disabled = input(false);
}
