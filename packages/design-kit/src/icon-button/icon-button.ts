import { LitElement, html, unsafeCSS, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { ErrorEvent } from '../core/event/error.event';
import type { Loudness } from '../core/loudness';

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
 */
@customElement('mh-icon-button')
export class IconButton extends LitElement {
  static override readonly styles = [loudness, styles, appearance].map(
    unsafeCSS,
  );

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
