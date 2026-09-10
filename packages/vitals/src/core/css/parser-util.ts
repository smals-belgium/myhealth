import { CssParseError } from './css-parse-error';

/** Factory for CSS parse error objects from a predefined collection of messages with type safety. */
export const validate =
  <T extends Record<string, string>>(messages: T) =>
  (cssStringValue: string) =>
  (msgKey: keyof T) =>
    new CssParseError(messages[msgKey], cssStringValue);

/** Functional style `trim` wrapper */
export const trim = (value: string) => value.trim();

/**
 * Splits an array of "eithers" into two arrays:
 * - one array with items that pass the test (right)
 * - one array with items that fail the test (left)
 */
const partition =
  <Left, Right>(refinement: (either: Left | Right) => either is Right) =>
  (eithers: (Left | Right)[]): [Left[], Right[]] => {
    const lefts: Left[] = [];
    const rights: Right[] = [];

    eithers.forEach(x => (refinement(x) ? rights.push(x) : lefts.push(x)));

    return [lefts, rights];
  };

const isValid = <T>(x: T | Error): x is T => !(x instanceof Error);

/**
 * Splits an array of validation results into two arrays:
 * - one array with succesfully parsed types
 * - one array with parsing errors
 */
export const partitionErrors = <T>(xs: (T | Error)[]) =>
  partition<Error, T>(isValid)(xs);
