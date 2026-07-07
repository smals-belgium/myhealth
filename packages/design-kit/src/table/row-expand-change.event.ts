export class RowExpandChangeEvent extends Event {
  readonly expanded: boolean;

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
