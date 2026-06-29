export class ChipSelectionChangeEvent extends Event {
  /** Whether the chip is selected after the change. */
  readonly selected: boolean;

  constructor(selected: boolean) {
    super('mh-chip-selection-change', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    this.selected = selected;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-chip-selection-change': ChipSelectionChangeEvent;
  }
}
