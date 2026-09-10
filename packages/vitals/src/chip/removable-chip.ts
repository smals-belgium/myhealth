import { html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { LocalizeController } from '../core/i18n';
import touchTarget from '../core/touch-target.css?inline';

import { InteractiveChipBase } from './base';
import { ChipRemoveEvent } from './chip-remove.event';
import styles from './chip.css?inline';
import removableStyles from './removable-chip.css?inline';

/**
 * @summary Removable chips represent a piece of user input and can be dismissed.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/chip
 * @status stable
 * @since 1.0
 *
 * @dependency mh-icon
 *
 * @event mh-chip-remove - Emitted when the chip requests removal. The host is not removed from the
 *  DOM automatically; the consumer decides whether to remove it.
 *
 * @slot - The chip's label.
 * @slot start - An element, such as `<mh-icon>`, placed before the label.
 *
 * @csspart base - The component's base wrapper (`<span>`).
 * @csspart start - The container that wraps the `start` slot.
 * @csspart main - The container that wraps the label.
 * @csspart remove - The trailing remove `<button>`.
 *
 * @cssproperty [--mh-chip__size-height=2rem] - The chip's minimum height.
 * @cssproperty [--mh-chip__color-type=var(--mh-color-neutral-type)] - The chip's text color.
 * @cssproperty [--mh-chip__size-icon=1rem] - The size of the remove icon.
 */
@customElement('mh-removable-chip')
export class RemovableChip extends InteractiveChipBase {
  static override readonly styles = [styles, removableStyles, touchTarget].map(
    unsafeCSS,
  );

  private readonly localize = new LocalizeController(this);

  @query('[part="remove"]') removeButton!: HTMLElement;

  /** A value associated with the chip, surfaced on the `mh-chip-remove` event. */
  @property() value?: string;

  /** A custom accessible label for the chip. Defaults to a localized "remove <label>". */
  @property({ attribute: 'remove-label' }) removeLabel?: string;

  override readonly focus = () => this.removeButton.focus();
  override readonly blur = () => this.removeButton.blur();

  get #removeLabel() {
    if (this.removeLabel) return this.removeLabel;
    const label = this.textContent.trim();
    return label
      ? `${this.localize.term('remove')} ${label}`
      : this.localize.term('remove');
  }

  #requestRemove = () => {
    this.dispatchEvent(new ChipRemoveEvent(this.value));
  };

  #onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) return;
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      this.#requestRemove();
    }
  };

  override render() {
    return html`
      <span part="base">
        <slot
          name="start"
          part="start"
        ></slot>
        <slot part="main"></slot>
        <button
          part="remove"
          class="mh-touch-target"
          type="button"
          aria-label=${this.#removeLabel}
          ?disabled=${this.disabled}
          @click=${this.#requestRemove}
          @keydown=${this.#onKeyDown}
        >
          <mh-icon name="close"></mh-icon>
        </button>
      </span>
    `;
  }
}
