import { Directive, input } from '@angular/core';

import type { IconSize } from '@myhealth/design-kit/icon';

@Directive({
  selector: 'mh-icon',
  host: {
    '[attr.name]': 'name()',
    '[attr.src]': 'src()',
    '[attr.label]': 'label()',
    '[attr.size]': 'size()',
    '[attr.rotate]': 'rotate()',
  },
})
export class Icon {
  readonly name = input<string>();
  readonly src = input<string>();
  readonly label = input('');
  readonly size = input<IconSize>('m');
  readonly rotate = input(0);
}
