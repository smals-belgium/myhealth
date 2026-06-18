export class DialogAfterOpenedEvent extends Event {
  constructor() {
    super('mh-after-opened', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
  }
}

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
    'mh-after-opened': DialogAfterOpenedEvent;
    'mh-after-closed': DialogAfterClosedEvent;
  }
}
