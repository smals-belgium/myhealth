import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { slotContentDirective } from '../core/directive';
import { LocalizeController } from '../core/i18n';

import { CalloutBase } from './base';

/**
 * @summary Callouts are inline banners that communicate a contextual status or message. They show a fixed icon for
 *  their variant, a title, an optional description, optional actions, and a close button. The content region is
 *  announced to screen readers as a status message (polite) for info/success/neutral/brand variants, or as an alert
 *  (assertive) for danger/warning variants.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/callout
 * @status stable
 * @since 1.0
 *
 * @dependency mh-icon
 * @dependency mh-icon-button
 *
 * @event mh-callout-closed - Emitted after the close button is activated and the callout removes itself.
 *
 * @slot - The callout's descriptive content, shown below the title.
 * @slot title - The callout's title, shown next to the icon.
 * @slot actions - The callout's actions, typically buttons.
 *
 * @csspart icon - The variant icon at the start of the callout.
 * @csspart title - The container for the `title` slot.
 * @csspart close - The close (`X`) icon button.
 * @csspart region - The center column that wraps the title, description, and actions. Has role="status" or role="alert" based on variant.
 * @csspart content - The inner wrapper that holds the description and actions.
 * @csspart description - The container for the `description` slot.
 * @csspart actions - The container that wraps the `actions` slot.
 *
 * @cssproperty [--mh-callout__size-space=var(--mh-space-m)] - The amount of space around and between sections of the callout.
 * @cssproperty [--mh-callout__box-shadow=var(--mh-shadow-s)] - The shadow cast by the callout.
 * @cssproperty [--mh-callout__color-fill=var(--mh-color-info-fill)] - The background color of the callout.
 * @cssproperty [--mh-callout__color-type=var(--mh-color-info-type)] - The text color of the callout.
 * @cssproperty [--mh-callout__color-icon=var(--mh-color-info-icon)] - The color of the variant icon.
 * @cssproperty [--mh-callout__color-close=var(--mh-color-info-icon)] - The color of the close button icon.
 * @cssproperty [--mh-callout__color-focus=var(--mh-color-info-border-loud)] - The focus ring color of the close button.
 * @cssproperty [--mh-callout__size-icon=var(--mh-icon-size-s)] - The size of the variant icon.
 */
@customElement('mh-callout')
export class Callout extends CalloutBase {
  private readonly localize = new LocalizeController(this);

  /** Whether to show the close button. Not shown by default. */
  @property({ type: Boolean, reflect: true }) closable = false;

  #onCloseClick = () => {
    this.dispatchEvent(new Event('close'));
    this.remove();
  };

  override render() {
    return html`
      ${this.renderIcon()}

      <div
        part="content"
        role=${this.getContentRole()}
        aria-labelledby="title"
        aria-live=${this.getContentRole() === 'alert' ? 'assertive' : 'polite'}
      >
        <slot
          id="title"
          part="title"
          name="title"
        ></slot>
        <slot part="description"></slot>
        <slot
          part="actions"
          name="actions"
          @slotchange=${slotContentDirective}
        ></slot>
      </div>

      ${
        this.closable
          ? html`
              <mh-icon-button
                part="close"
                name="close"
                label=${this.localize.term('close')}
                @click=${this.#onCloseClick}
              ></mh-icon-button>
            `
          : nothing
      }
    `;
  }
}
