export interface ChipSelectionChangeDetail {
  /** The `value` of the chip that changed selection state, if any. */
  value?: string;
  /** Whether the chip is selected after the change. */
  selected: boolean;
}

export class ChipSelectionChangeEvent extends CustomEvent<ChipSelectionChangeDetail> {
  /** Whether the chip is selected after the change. Shorthand for `event.detail.selected`. */
  get selected(): boolean {
    return this.detail.selected;
  }

  constructor(detail: ChipSelectionChangeDetail) {
    super('mh-chip-selection-change', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail,
    });
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-chip-selection-change': ChipSelectionChangeEvent;
  }
}
