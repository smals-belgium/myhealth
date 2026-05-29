import { LitElement, unsafeCSS } from 'lit';
import { property, query } from 'lit/decorators.js';

import { Size, Variant } from '../core';

import styles from './button.css?inline';
import appearance from './button.appearance.css?inline';
import size from '../form-control/form-control.size.css?inline';
import variant from '../core/variant.css?inline';

export type ButtonAppearance = 'filled' | 'outlined' | 'link';
export type ButtonSize = Extract<Size, 's' | 'm'>;
export type ButtonVariant = Exclude<Variant, 'neutral'>;

export abstract class ButtonBase extends LitElement {
  static override readonly styles = [styles, appearance, size, variant].map(
    unsafeCSS,
  );

  @query('[part="base"]') el!: HTMLElement;

  @property() override title = ''; // make reactive to pass through

  /** The button's theme variant. Defaults to `brand` if not within another element with a variant. */
  @property({ reflect: true }) variant: ButtonVariant = 'brand';

  /** The button's visual appearance. */
  @property({ reflect: true }) appearance: ButtonAppearance = 'filled';

  /** The button's size. */
  @property({ reflect: true }) size: ButtonSize = 'm';

  override readonly click = () => this.el.click();
  override readonly focus = () => this.el.focus();
  override readonly blur = () => this.el.blur();
}
