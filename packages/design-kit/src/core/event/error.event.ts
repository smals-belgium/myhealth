export class ErrorEvent extends Event {
  readonly message;
  readonly error?: Error;

  constructor();
  constructor(message: string);
  constructor(error: Error);
  constructor(message: string, error: Error);
  constructor(
    msgOrError: string | Error = 'MyHealth design kit error',
    error?: Error,
  ) {
    super('mh-error', { bubbles: true, cancelable: false, composed: true });

    if (typeof msgOrError === 'string') {
      this.message = msgOrError;
      this.error = error;
    } else {
      this.message = msgOrError.message;
      this.error = msgOrError;
    }
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-error': ErrorEvent;
  }
}
