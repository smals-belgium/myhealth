import { Directive } from '@angular/core';

/**
 * Angular directive wrapping `mh-table-cell`.
 *
 * Renders a single body cell (`role="cell"`). Use `mh-table-header-cell` for
 * column header cells.
 *
 * @example
 * ```html
 * <mh-table-cell>Alice</mh-table-cell>
 * ```
 */
@Directive({
  selector: 'mh-table-cell',
})
export class TableCell {}
