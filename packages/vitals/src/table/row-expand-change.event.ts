/** Fired by `mh-table-row` when the row's expansion state toggles. */
export class RowExpandChangeEvent extends Event {
  /** `true` if the row just expanded; `false` if it just collapsed. */
  readonly expanded: boolean;

  /** @param expanded - `true` when the row is now expanded; `false` when collapsed. */
  constructor(expanded: boolean) {
    super('mh-table-row-expand-change', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    this.expanded = expanded;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-table-row-expand-change': RowExpandChangeEvent;
  }
}
