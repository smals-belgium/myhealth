import { LitElement, html, unsafeCSS, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { ErrorEvent } from '../core/event/error.event';
import type { Loudness } from '../core/loudness';
import touchTarget from '../core/touch-target.css?inline';

import appearance from './icon-button.appearance.css?inline';
import styles from './icon-button.css?inline';
import loudness from './icon-button.loudness.css?inline';

export type IconButtonAppearance = 'round' | 'square';
export type IconButtonLoudness = Extract<Loudness, 'normal' | 'loud'>;

/**
 * @summary Icon buttons are used to trigger actions with a single icon and no visible label.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/icon-button
 * @status stable
 * @since 1.0
 *
 * @dependency mh-icon
 *
 * @event click - Emitted when the icon button is clicked.
 * @event blur - Emitted when the icon button loses focus.
 * @event focus - Emitted when the icon button gains focus.
 * @event mh-error - Emitted when accessibility check fails.
 *
 * @csspart button - The native button.
 * @csspart icon - The inner `<mh-icon>` element.
 *
 * @cssproperty [--mh-icon-button__size-icon=2.5rem] - The size of the icon button (width and height).
 * @cssproperty --mh-icon-button__color-type - The icon color. Defaults vary by loudness.
 * @cssproperty --mh-icon-button__color-type__hover - The icon color on hover.
 * @cssproperty --mh-icon-button__color-type__active - The icon color when pressed.
 * @cssproperty [--mh-icon-button__color-type__disabled=var(--mh-color-neutral-type)] - The icon color when disabled.
 * @cssproperty --mh-icon-button__color-fill - The background color. Defaults vary by loudness.
 * @cssproperty --mh-icon-button__color-fill__hover - The background color on hover.
 * @cssproperty --mh-icon-button__color-fill__active - The background color when pressed.
 * @cssproperty --mh-icon-button__color-fill__disabled - The background color when disabled.
 */
@customElement('mh-icon-button')
export class IconButton extends LitElement {
  static override readonly styles = [
    loudness,
    styles,
    appearance,
    touchTarget,
  ].map(unsafeCSS);

  @query('[part="button"]') el!: HTMLElement;

  @property() override title = '';

  @property() label?: string;

  /** The name of the icon to display. */
  @property({ reflect: true }) name!: string;

  @property({ reflect: true }) appearance: IconButtonAppearance = 'round';

  /** The button's loudness. An icon button has no variants. */
  @property({ reflect: true }) loudness: IconButtonLoudness = 'normal';

  /** Disables the button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  override readonly click = () => this.el.click();
  override readonly focus = () => this.el.focus();
  override readonly blur = () => this.el.blur();

  override willUpdate(props: PropertyValues<this>) {
    if (
      (props.has('title') || props.has('label')) &&
      !((this.label ?? '') + this.title).trim()
    )
      this.dispatchEvent(
        new ErrorEvent(
          'An icon button must have a "title" or "label" property for accessibility reasons',
        ),
      );
  }

  override render() {
    return html`
      <button
        part="button"
        class="mh-touch-target"
        ?disabled=${this.disabled}
        title=${this.title}
        aria-label=${this.label ?? this.title}
      >
        <mh-icon
          part="icon"
          name=${this.name}
        ></mh-icon>
      </button>
    `;
  }
}
