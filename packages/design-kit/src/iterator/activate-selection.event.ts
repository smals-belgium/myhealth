export class ActivateSelectionEvent extends Event {
  readonly value: string | null;

  constructor(value: string | null) {
    super('mh-activate-selection', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    this.value = value;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-activate-selection': ActivateSelectionEvent;
  }
}
