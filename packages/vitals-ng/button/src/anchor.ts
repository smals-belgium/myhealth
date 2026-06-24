import { Directive, input } from '@angular/core';

// eslint-disable-next-line import/no-unassigned-import
import '@myhealth/design-kit';
import type {
  ButtonAppearance,
  ButtonSize,
  ButtonVariant,
} from '@myhealth/design-kit';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mh-a',
  standalone: true,
  host: {
    '[attr.href]': 'href()',
    '[attr.title]': 'title()',
    '[attr.target]': 'target()',
    '[attr.rel]': 'rel()',
    '[attr.download]': 'download()',
    '[attr.variant]': 'variant()',
    '[attr.appearance]': 'appearance()',
    '[attr.size]': 'size()',
    '[attr.disabled]': 'disabled() ? "" : null',
  },
})
export class Anchor {
  readonly href = input.required<string>();
  readonly title = input('');
  readonly target = input<HTMLAnchorElement['target']>('_self');
  readonly rel = input<string>();
  readonly download = input<string>();
  readonly variant = input<ButtonVariant>('brand');
  readonly appearance = input<ButtonAppearance>('filled');
  readonly size = input<ButtonSize>('m');
  readonly disabled = input(false);
}
