import { Directive, input } from '@angular/core';

/**
 * Angular directive wrapping `mh-table-cell`.
 *
 * Exposes `header` as an Angular input to render the cell as a column header.
 *
 * @example
 * ```html
 * <mh-table-cell slot="header" [header]="true">Name</mh-table-cell>
 * ```
 */
@Directive({
  selector: 'mh-table-cell',
  host: {
    '[attr.header]': 'header() ? "" : null',
  },
})
export class TableCell {
  /** When set, this cell acts as a column header (`role="columnheader"`). */
  readonly header = input(false);
}
