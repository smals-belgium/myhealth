export class CalloutAfterClosedEvent extends Event {
  readonly result?: string | boolean;

  constructor(result?: string | boolean) {
    super('mh-callout-after-closed', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    this.result = result;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-callout-after-closed': CalloutAfterClosedEvent;
  }
}
