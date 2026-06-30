import { Directive, input } from '@angular/core';

import type {
  ButtonAppearance,
  ButtonSize,
  ButtonVariant,
} from '@myhealth/design-kit/button';

@Directive({
  selector: 'mh-button',
  standalone: true,
  host: {
    '[attr.title]': 'title()',
    '[attr.type]': 'type()',
    '[attr.variant]': 'variant()',
    '[attr.appearance]': 'appearance()',
    '[attr.size]': 'size()',
    '[attr.loading]': 'loading() ? "" : null',
    '[attr.disabled]': 'disabled() ? "" : null',
  },
})
export class Button {
  readonly title = input('');
  readonly type = input<HTMLButtonElement['type']>('button');
  readonly variant = input<ButtonVariant>('brand');
  readonly appearance = input<ButtonAppearance>('filled');
  readonly size = input<ButtonSize>('m');
  readonly loading = input(false);
  readonly disabled = input(false);
}
