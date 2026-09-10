export class SnackbarOpenedEvent extends Event {
  constructor() {
    super('mh-snackbar-opened', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-snackbar-opened': SnackbarOpenedEvent;
  }
}
