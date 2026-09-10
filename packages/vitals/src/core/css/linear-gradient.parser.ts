import { partitionErrors, trim, validate } from './parser-util';
import { isStop, parseStop, Stop } from './stop.parser';

/**
 * SVG: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/linearGradient
 * CSS: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/linear-gradient
 */
export type LinearGradient = {
  /**
   * The angle of the linear gradient in degrees, 0 to 360, negative values allowed.
   * The angle can converted to SVG line coordinates when necessary.
   */
  angle: number;

  /** A list of color stops. */
  stops: Stop[];
};

const validation = validate({
  function: 'Not a linear gradient function',
  argCount: 'Expected at least two arguments to the gradient function',
  firstArg:
    'First argument should be an angle value in degrees or a valid color stop',
});

/**
 * Regex that matches a CSS angle value defined in degrees.
 * - starts with 1 to 3 digits
 * - ends with `deg`
 *
 * @example
 * 315deg   // valid
 * 2356deg  // invalid
 * 315      // invalid
 */
const angleRegEx = () => /^(?<value>\d{1,3})deg$/gmu;
const isValidAngle = (value: string) => angleRegEx().test(value);
const parseAngle = (value: string) =>
  parseInt(angleRegEx().exec(value)?.groups?.value ?? '0', 10);

/**
 * Takes a CSS string value, validates it as a proper linear-gradient function, and returns a structured data object
 * based on the values in that string.
 *
 * !important: only a subset of the full CSS spec is supported
 *
 * - angle defaults to 0 if not defined
 * - there must be at least two arguments
 * - color stops must define a color in hex and an offset in percentage
 *
 * @example
 * ```css
 * // input
 * --mh-icon__color-gradient: linear-gradient(229deg, #2473db -37.55%, #76e1b1 100%);
 * ```
 *
 * ```json
 * // output
 * {
 *  angle: 229,
 *  stops: [
 *    { color: '#2473db', offset: -37.55 },
 *    { color: '#76e1b1', offset: 100 },
 *  ]
 * }
 * ```
 */
export const parseLinearGradient = (value: string): LinearGradient | Error => {
  const error = validation(value);
  const groups = /linear-gradient\((?<args>.*)\)/gmu.exec(value)?.groups;
  if (!groups || !('args' in groups)) return error('function');

  const args = groups.args.split(',').map(trim);
  if (args.length < 2) return error('argCount');

  const [head, ...tail] = args;
  if (!isValidAngle(head) && !isStop(head)) return error('firstArg');

  const [failures, stops] = partitionErrors(
    (isValidAngle(head) ? tail : args).map(parseStop),
  );
  if (failures.length) return failures[0];

  return { angle: parseAngle(head), stops };
};
