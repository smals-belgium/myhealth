import { Directive, input, output } from '@angular/core';

/**
 * Angular directive wrapping `mh-table`.
 *
 * Exposes `selectable` and `caption` as Angular inputs and
 * `mh-table-selection-change` as an Angular output that emits the array of
 * selected row values.
 *
 * @example
 * ```html
 * <mh-table [selectable]="selectable" (selectionChange)="onSelect($event)">
 *   <mh-table-cell slot="header" header>Name</mh-table-cell>
 *   <mh-table-row value="1"><mh-table-cell>Alice</mh-table-cell></mh-table-row>
 * </mh-table>
 * ```
 */
@Directive({
  selector: 'mh-table',
  host: {
    '[attr.selectable]': 'selectable() ? "" : null',
    '[attr.caption]': 'caption() || null',
    '(mh-table-selection-change)':
      'selectionChange.emit($any($event).selected)',
  },
})
export class Table {
  /** Enables row selection with per-row checkboxes and a select-all header checkbox. */
  readonly selectable = input(false);

  /** Accessible label for the table, exposed as `aria-label` (there is no visible caption). */
  readonly caption = input('');

  /** Emits the `value` array of currently selected rows whenever selection changes. */
  readonly selectionChange = output<string[]>();
}
