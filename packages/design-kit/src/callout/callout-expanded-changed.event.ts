export class CalloutExpandedChangedEvent extends Event {
  readonly expanded: boolean;

  constructor(expanded: boolean) {
    super('mh-callout-expanded-changed', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    this.expanded = expanded;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-callout-expanded-changed': CalloutExpandedChangedEvent;
  }
}
