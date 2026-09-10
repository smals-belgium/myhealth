export interface TabGroupSelectedChangeDetail {
  /** The index of the newly selected tab. */
  index: number;
}

export class TabGroupSelectedChangeEvent extends CustomEvent<TabGroupSelectedChangeDetail> {
  /** The index of the newly selected tab. Shorthand for `event.detail.index`. */
  get index(): number {
    return this.detail.index;
  }

  constructor(index: number) {
    super('mh-tab-group-selected-change', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: { index },
    });
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-tab-group-selected-change': TabGroupSelectedChangeEvent;
  }
}
