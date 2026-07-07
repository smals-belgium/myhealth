export class SelectionChangeEvent extends Event {
  readonly selected: string[];

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
