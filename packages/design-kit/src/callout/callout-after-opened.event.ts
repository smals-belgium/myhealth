export class CalloutAfterOpenedEvent extends Event {
  constructor() {
    super('mh-callout-after-opened', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-callout-after-opened': CalloutAfterOpenedEvent;
  }
}
