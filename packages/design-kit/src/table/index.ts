import type { Table } from './table';
import type { TableCell } from './table-cell';
import type { TableRow } from './table-row';

export * from './row-expand-change.event';
export * from './selection-change.event';
export * from './table';
export * from './table-cell';
export * from './table-row';

declare global {
  interface HTMLElementTagNameMap {
    'mh-table': Table;
    'mh-table-cell': TableCell;
    'mh-table-row': TableRow;
  }
}
