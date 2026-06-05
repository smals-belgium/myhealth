import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { ButtonBase } from './base.js';

/**
 * @summary Buttons represent actions the user can take, such as submitting a form, opening a dialog, or navigating to
 *  another page.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/button
 * @status stable
 * @since 1.0
 *
 * @dependency mh-icon
 *
 * @event click - Emitted when the button is clicked.
 * @event blur - Emitted when the button loses focus.
 * @event focus - Emitted when the button gains focus.
 *
 * @slot - The button's label.
 * @slot start - An element, such as `<mh-icon>`, placed before the label.
 * @slot end - An element, such as `<mh-icon>`, placed after the label.
 *
 * @csspart base - The component's base wrapper.
 * @csspart start - The container that wraps the `start` slot.
 * @csspart main - The button's main content; usually a label, but it can be just an icon as well.
 * @csspart end - The container that wraps the `end` slot.
 *
 * @cssstate icon-button - Applied when the button contains only a `<mh-icon>` with no other content.
 */
@customElement('mh-a')
export class Anchor extends ButtonBase {
  @property() href!: string;

  /** Tells the browser where to open the link. Only used when `href` is present. */
  @property() target: HTMLAnchorElement['target'] = '_self';

  /** This attribute will map to the underlying link's `rel` attribute. */
  @property() rel?: string;

  /** Tells the browser to download the linked file as this filename. */
  @property() download?: string;

  /** Disables the hyperlink even though not natively supported. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** An anchor tag doesn't normally have a disabled state, so we simulate it. */
  #handleClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  override render() {
    return html`
      <a
        part="base"
        title=${this.title}
        href=${this.href}
        target=${this.target}
        download=${ifDefined(this.download)}
        rel=${ifDefined(this.rel)}
        aria-disabled=${this.disabled}
        tabindex=${this.disabled ? '-1' : '0'}
        @click=${this.#handleClick}
      >
        <slot name="start" part="start"></slot>
        <slot part="main"></slot>
        <slot name="end" part="end"></slot>
      </a>
    `;
  }
}
