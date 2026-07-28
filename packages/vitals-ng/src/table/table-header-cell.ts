import { Directive } from '@angular/core';

/**
 * Angular directive wrapping `mh-table-header-cell`.
 *
 * Renders a column header cell (`role="columnheader"`) for slotting into the
 * `header` slot of `mh-table`.
 *
 * @example
 * ```html
 * <mh-table-header-cell slot="header">Name</mh-table-header-cell>
 * ```
 */
@Directive({
  selector: 'mh-table-header-cell',
})
export class TableHeaderCell {}
