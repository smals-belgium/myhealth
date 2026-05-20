export class LoadEvent extends Event {
  constructor() {
    super('mh-load', { bubbles: true, cancelable: false, composed: true });
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-load': LoadEvent;
  }
}
