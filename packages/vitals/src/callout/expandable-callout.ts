import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { childEventDirective, slotContentDirective } from '../core/directive';
import { openCloseBehaviour } from '../core/open-close.behaviour';

import { CalloutBase } from './base';
import expandable from './expandable-callout.css?inline';

export const calloutCloseDirective = 'mh-callout-close';

/**
 * @summary Expandable callouts are inline banners that disclose their content on demand. Built on the native
 *  `<details>` element, they show a fixed icon for their variant, a title, and a chevron; activating the header
 *  expands or collapses the description and optional actions. The content region is announced to screen readers
 *  as a status message (polite) for info/success/neutral/brand variants, or as an alert (assertive) for
 *  danger/warning variants.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/expandable-callout
 * @status stable
 * @since 1.0
 *
 * @dependency mh-icon
 *
 * @event toggle - Emitted when the callout is expanded or collapsed.
 * @event mh-callout-closed - Emitted when a `callout-close` button is activated and the callout removes itself.
 *
 * @slot - The callout's descriptive content, shown below the title when expanded.
 * @slot title - The callout's title, shown next to the icon. Activating it toggles the callout.
 * @slot actions - The callout's actions, typically buttons. Add the `callout-close` attribute to any element
 *  here to dismiss and remove the callout when it is activated.
 *
 * @csspart icon - The variant icon at the start of the callout.
 * @csspart header - The `<summary>` toggle that wraps the icon, title, and chevron.
 * @csspart title - The container for the `title` slot.
 * @csspart toggle - The chevron icon shown at the end of the header.
 * @csspart region - The collapsible region that wraps the description and actions. Has role="status" or role="alert" based on variant.
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
 * @cssproperty [--mh-callout__color-focus=var(--mh-color-info-border-loud)] - The focus ring color of the toggle.
 * @cssproperty [--mh-callout__size-icon=var(--mh-icon-size-s)] - The size of the variant icon.
 */
@customElement('mh-expandable-callout')
export class ExpandableCallout extends CalloutBase {
  static override readonly styles = [
    ...CalloutBase.styles,
    unsafeCSS(expandable),
  ];

  /** Whether the callout is expanded. Reflects as an attribute. */
  @property({ type: Boolean, reflect: true }) open = false;

  readonly #openClose = openCloseBehaviour(this);

  /**
   * Expands or collapses the callout.
   * @see openCloseBehaviour#toggle
   */
  readonly toggle = this.#openClose.toggle;

  #onCloseTrigger = childEventDirective({
    name: calloutCloseDirective,
    onEvent: () => {
      this.dispatchEvent(new Event('close'));
      this.remove();
    },
  });

  override render() {
    return html`
      <details
        ?open=${this.open}
        @toggle=${this.#openClose.onToggle}
      >
        <summary part="header">
          ${this.renderIcon()}
          <span
            part="title"
            id="title"
          >
            <slot name="title"></slot>
          </span>
          <mh-icon
            part="toggle"
            name="keyboard_arrow_down"
            aria-hidden="true"
          ></mh-icon>
        </summary>

        <div
          part="content"
          role=${this.getContentRole()}
          aria-labelledby="title"
          aria-live=${
            this.getContentRole() === 'alert' ? 'assertive' : 'polite'
          }
          @click=${this.#onCloseTrigger}
        >
          <slot part="description"></slot>
          <slot
            part="actions"
            name="actions"
            @slotchange=${slotContentDirective}
          ></slot>
        </div>
      </details>
    `;
  }
}
