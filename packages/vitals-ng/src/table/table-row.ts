import { Directive, input, output } from '@angular/core';

/**
 * Angular directive wrapping `mh-table-row`.
 *
 * Exposes the row's public properties as Angular inputs and supports two-way
 * binding for `selected` (`[(selected)]`) and `expanded` (`[(expanded)]`).
 *
 * @example
 * ```html
 * <mh-table-row
 *   [value]="'1'"
 *   [expandable]="true"
 *   [(expanded)]="isExpanded"
 *   [(selected)]="isSelected"
 * >
 *   <mh-table-cell>Alice</mh-table-cell>
 *   <span slot="expansion">More details</span>
 * </mh-table-row>
 * ```
 */
@Directive({
  selector: 'mh-table-row',
  host: {
    '[attr.value]': 'value() || null',
    '[attr.expandable]': 'expandable() ? "" : null',
    '[attr.expanded]': 'expanded() ? "" : null',
    '[attr.selected]': 'selected() ? "" : null',
    '[attr.disabled]': 'disabled() ? "" : null',
    '(change)': 'selectedChange.emit($any($event.target).selected)',
    '(mh-table-row-expand-change)':
      'expandedChange.emit($any($event).expanded)',
  },
})
export class TableRow {
  /** Identifier reported in the parent table's selection change event. */
  readonly value = input('');

  /** When set, shows a chevron button to expand/collapse additional row content. */
  readonly expandable = input(false);

  /** Whether the row expansion region is visible. Supports two-way binding. */
  readonly expanded = input(false);

  /** Whether this row's checkbox is checked. Supports two-way binding. */
  readonly selected = input(false);

  /** When set, the row's checkbox is shown but not interactive. */
  readonly disabled = input(false);

  /** Emits the new `selected` state whenever this row's selection changes. */
  readonly selectedChange = output<boolean>();

  /** Emits the new `expanded` state whenever this row is expanded or collapsed. */
  readonly expandedChange = output<boolean>();
}
