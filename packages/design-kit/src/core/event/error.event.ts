// In general, error should be Error type, but we'll allow unknown types for more robust handling of UFOs
type ErrorArgs = [error: unknown] | [message: string, error: unknown];

const toMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

const toError = (error: unknown) =>
  error instanceof Error
    ? error
    : new Error('Unexpected error type', { cause: error });

export class ErrorEvent extends Event {
  readonly message;
  readonly error?: Error;

  constructor(...args: ErrorArgs) {
    super('mh-error', { bubbles: true, cancelable: false, composed: true });

    switch (args.length) {
      case 1:
        const [unknownErrorWithoutMessage] = args;
        this.message = toMessage(unknownErrorWithoutMessage);
        break;
      case 2:
        const [message, unknownError] = args;
        this.message = message;
        this.error = toError(unknownError);
        break;
      default:
        // Options exhausted
        break;
    }
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-error': ErrorEvent;
  }
}
