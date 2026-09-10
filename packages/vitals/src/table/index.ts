import type { Table } from './table';
import type { TableCell } from './table-cell';
import type { TableHeaderCell } from './table-header-cell';
import type { TableRow } from './table-row';

export * from './row-expand-change.event';
export * from './selection-change.event';
export * from './selection-mode';
export * from './table';
export * from './table-cell';
export * from './table-header-cell';
export * from './table-row';

declare global {
  interface HTMLElementTagNameMap {
    'mh-table': Table;
    'mh-table-cell': TableCell;
    'mh-table-header-cell': TableHeaderCell;
    'mh-table-row': TableRow;
  }
}
