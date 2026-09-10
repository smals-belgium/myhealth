/** Describes why a snackbar was dismissed. */
export type SnackbarDismissReason =
  'action-button' | 'timeout' | 'programmatic';

export class SnackbarDismissedEvent extends Event {
  readonly reason: SnackbarDismissReason;

  constructor(reason: SnackbarDismissReason = 'programmatic') {
    super('mh-snackbar-dismissed', {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    this.reason = reason;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-snackbar-dismissed': SnackbarDismissedEvent;
  }
}
