export class DialogAfterOpenedEvent extends Event {
  constructor() {
    super('mh-after-opened', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-after-opened': DialogAfterOpenedEvent;
  }
}
