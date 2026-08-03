import { Directive, input } from '@angular/core';

@Directive({
  selector: 'mh-tab-link',
  host: {
    '[attr.label]': 'label()',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.href]': 'href()',
    '[attr.target]': 'target()',
    '[attr.rel]': 'rel()',
    '[attr.download]': 'download()',
  },
})
export class TabLink {
  readonly label = input('');
  readonly disabled = input(false);
  readonly href = input<string>();
  readonly target = input<HTMLAnchorElement['target']>('_self');
  readonly rel = input<string>();
  readonly download = input<string>();
}
