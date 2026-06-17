export class DialogAfterOpenedEvent extends Event {
  constructor() {
    super('mh-after-opened', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
  }
}

export class DialogAfterClosedEvent<T = unknown> extends Event {
  readonly result?: T;

  constructor(result?: T) {
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
