export class ChipRemoveEvent extends Event {
  /** The `value` of the chip that requested removal, if any. */
  readonly value?: string;

  constructor(value?: string) {
    super('mh-chip-remove', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    this.value = value;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-chip-remove': ChipRemoveEvent;
  }
}
