/**
 * Row selection behavior for `mh-table`:
 * - `none` — rows cannot be selected.
 * - `single` — at most one row can be selected at a time, via a radio button per row.
 * - `multi` — any number of rows can be selected, via a checkbox per row and a select-all checkbox in the header.
 */
export type SelectionMode = 'none' | 'single' | 'multi';
