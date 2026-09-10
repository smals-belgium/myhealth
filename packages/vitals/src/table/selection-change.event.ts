/** Fired by `mh-table` when the set of selected row values changes. */
export class SelectionChangeEvent extends Event {
  /** The `value` of every currently selected (and non-empty) body row at the time of the event. */
  readonly selected: string[];

  /** @param selected - Array of selected row `value` strings. */
  constructor(selected: string[]) {
    super('mh-table-selection-change', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    this.selected = selected;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-table-selection-change': SelectionChangeEvent;
  }
}
