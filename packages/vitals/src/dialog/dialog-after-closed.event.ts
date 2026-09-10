export class DialogAfterClosedEvent extends Event {
  readonly result?: string | boolean;

  constructor(result?: string | boolean) {
    super('mh-after-closed', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    this.result = result;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-after-closed': DialogAfterClosedEvent;
  }
}
