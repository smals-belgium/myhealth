/**
 * An error that occurs while parsing CSS string values.
 * Contains the original string value as a payload for inspection.
 */
export class CssParseError extends Error {
  readonly value: string;

  constructor(message: string, value: string) {
    super(message);
    this.value = value;
  }
}
