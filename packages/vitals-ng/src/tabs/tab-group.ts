import { Directive, input } from '@angular/core';

@Directive({
  selector: 'mh-tab-group',
  host: {
    '[attr.selected-index]': 'selectedIndex()',
  },
})
export class TabGroup {
  readonly selectedIndex = input(0);
}
