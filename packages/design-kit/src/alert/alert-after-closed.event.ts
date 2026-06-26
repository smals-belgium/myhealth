export class AlertAfterClosedEvent extends Event {
  readonly result?: string | boolean;

  constructor(result?: string | boolean) {
    super('mh-alert-after-closed', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    this.result = result;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-alert-after-closed': AlertAfterClosedEvent;
  }
}
