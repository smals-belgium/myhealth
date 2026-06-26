export class AlertAfterOpenedEvent extends Event {
  constructor() {
    super('mh-alert-after-opened', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-alert-after-opened': AlertAfterOpenedEvent;
  }
}
