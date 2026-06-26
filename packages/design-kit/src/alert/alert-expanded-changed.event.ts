export class AlertExpandedChangedEvent extends Event {
  readonly expanded: boolean;

  constructor(expanded: boolean) {
    super('mh-alert-expanded-changed', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    this.expanded = expanded;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-alert-expanded-changed': AlertExpandedChangedEvent;
  }
}
