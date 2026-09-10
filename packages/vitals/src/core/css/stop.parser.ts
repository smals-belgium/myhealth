import { trim, validate } from './parser-util';

/** https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/stop */
export type Stop = {
  /**
   * This attribute defines where the gradient stop is placed along the gradient vector.
   * Value in percentage (value from 0 to 100).
   */
  offset: number;

  /**
   * This attribute defines the color of the gradient stop.
   * Only hex values are supported.
   */
  color: `#${string}`;

  /**
   * This attribute defines the opacity of the gradient stop. It can be used as a CSS property.
   * Value in ratio from 0 t0 1.
   */
  opacity: number;
};

const validation = validate({
  hexColor: 'Invalid color value. Only hex values supported.',
  percentOffset: 'Invalid percentage',
});

/**
 * Regex that matches a CSS color value defined in hexadecimal format.
 * - starts with #
 * - has exactly 6 hexadecimal digits
 *
 * @example
 * #12abcd   // valid
 * #12ABCD   // valid
 * #12abcz   // invalid
 * 12abcd    // invalid
 */
const hexColorRegEx = () => /^#[A-Fa-f0-9]{6}$/gmu;
const isValidHex = (value = ''): value is `#${string}` =>
  hexColorRegEx().test(value);

/**
 * Regex that matches a CSS offset value defined in percents.
 * - starts with 1 to 3 integer digits
 * - optionally followed by any number of decimal point digits
 * - ends with %
 *
 * @example
 * 12%        // valid
 * 12.12348%  // valid
 * 12         // invalid
 * 0.12       // invalid
 */
const percentRE = () => /^(?<value>-?\d{1,3}(?<dec>\.\d+)?)%$/gmu;
const isValidPercent = (value = '') => percentRE().test(value);
const parsePercent = (value: string) =>
  parseFloat(percentRE().exec(value)?.groups?.value ?? '0');

export const isStop = (value: string) => value.startsWith('#');

/**
 * Takes a CSS string value, validates it as a proper stop argument, and returns a structured data object
 * based on the values in that string.
 *
 * !important: only a subset of the full CSS spec is supported
 *
 * - there must be at least two arguments
 * - color stops must define a color in hex and an offset in percentage
 *
 * @example
 * ```
 * // input
 * #2473db -37.55%;
 * ```
 *
 * ```json
 * // output
 * { color: '#2473db', offset: -37.55 },
 * ```
 */
export const parseStop = (value: string): Stop | Error => {
  const error = validation(value);
  const [color, percentage] = value.split(' ').map(trim);

  if (!isValidHex(color)) return error('hexColor');
  if (!isValidPercent(percentage)) return error('percentOffset');

  return { color, offset: parsePercent(percentage), opacity: 1 };
};
