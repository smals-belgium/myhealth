import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { ButtonBase } from './base';

/**
 * @summary Buttons represent actions the user can take, such as submitting a form, opening a dialog, or navigating to
 *  another page.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/button
 * @status stable
 * @since 1.0
 *
 * @dependency mh-icon
 * @dependency mh-spinner
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
 * @csspart spinner - The spinner that shows when the button is in the loading state.
 *
 * @cssstate icon-button - Applied when the button contains only a `<mh-icon>` with no other content.
 * @cssstate loading - Applied when the button is in the loading state.
 */
@customElement('mh-button')
export class Button extends ButtonBase {
  /**
   * The type of button. Note that the default value is `button` instead of `submit`, which is opposite of how native
   * `<button>` elements behave. When the type is `submit`, the button will submit the surrounding form.
   */
  @property() type: HTMLButtonElement['type'] = 'button';

  /** Draws the button in a loading state. */
  @property({ type: Boolean, reflect: true }) loading = false;

  /** Disables the button. */
  @property({ type: Boolean }) disabled = false;

  override render() {
    return html`
      <button
        part="base"
        ?disabled=${this.disabled}
        type=${this.type}
        title=${this.title}
      >
        <slot name="start" part="start"></slot>
        <slot part="main"></slot>
        <slot name="end" part="end"></slot>
        ${this.loading ? html`<mh-spinner part="spinner"></mh-spinner>` : ''}
      </button>
    `;
  }
}
