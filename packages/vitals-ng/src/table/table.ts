import { Directive, input, output } from '@angular/core';

import type { SelectionMode } from '@smals-belgium-shared/vitals/table';

/**
 * Angular directive wrapping `mh-table`.
 *
 * Exposes `selectionMode` and `caption` as Angular inputs and
 * `mh-table-selection-change` as an Angular output that emits the array of
 * selected row values.
 *
 * @example
 * ```html
 * <mh-table [selectionMode]="selectionMode" (selectionChange)="onSelect($event)">
 *   <mh-table-header-cell slot="header">Name</mh-table-header-cell>
 *   <mh-table-row value="1"><mh-table-cell>Alice</mh-table-cell></mh-table-row>
 * </mh-table>
 * ```
 */
@Directive({
  selector: 'mh-table',
  host: {
    '[attr.selection-mode]': 'selectionMode()',
    '[attr.caption]': 'caption() || null',
    '(mh-table-selection-change)':
      'selectionChange.emit($any($event).selected)',
  },
})
export class Table {
  /**
   * Controls row selection: `'none'` disables selection, `'single'` allows
   * one selected row via radio buttons (no select-all), `'multi'` allows
   * several via per-row checkboxes and a select-all header checkbox.
   */
  readonly selectionMode = input<SelectionMode>('none');

  /** Accessible label for the table, exposed as `aria-label` (there is no visible caption). */
  readonly caption = input('');

  /** Emits the `value` array of currently selected rows whenever selection changes. */
  readonly selectionChange = output<string[]>();
}
