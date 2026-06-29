import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import type { Variant } from '../core';
import { LocalizeController } from '../core/i18n';

import { ChipRemoveEvent } from './chip-remove.event';
import { ChipSelectionChangeEvent } from './chip-selection-change.event';
import styles from './chip.css?inline';
import filter from './chip.filter.css?inline';
import input from './chip.input.css?inline';
import status from './chip.status.css?inline';

/** The kind of chip, which determines its behavior and interaction model. */
export type ChipKind = 'status' | 'filter' | 'input';

/** The chip's theme variant. Only applies to `status` chips. */
export type ChipVariant = Variant | 'tertiary';

const renderStatus = () => html`
  <span part="base">
    <slot
      name="start"
      part="start"
    ></slot>
    <slot part="main"></slot>
  </span>
`;

/**
 * @summary Chips are compact elements that represent a status, a filter, or a piece of user input.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/chip
 * @status stable
 * @since 1.0
 *
 * @dependency mh-icon
 *
 * @event mh-chip-selection-change - Emitted when a `filter` chip is selected or deselected.
 * @event mh-chip-remove - Emitted when an `input` chip requests removal. The host is not removed from the DOM
 *  automatically; the consumer decides whether to remove it.
 *
 * @slot - The chip's label.
 * @slot start - An element, such as `<mh-icon>`, placed before the label.
 *
 * @csspart base - The component's base wrapper. A `<span>` for `status` chips and a `<button>` for `filter`/`input`
 *  chips.
 * @csspart start - The container that wraps the `start` slot.
 * @csspart main - The container that wraps the label.
 * @csspart checkmark - The leading checkmark shown on a selected `filter` chip.
 * @csspart remove - The trailing remove icon shown on an `input` chip.
 *
 * @cssproperty [--mh-chip__height=2rem] - The chip's minimum height.
 */
@customElement('mh-chip')
export class Chip extends LitElement {
  static override readonly styles = [styles, status, filter, input].map(
    unsafeCSS,
  );

  private readonly localize = new LocalizeController(this);

  @query('[part="base"]') el!: HTMLElement;

  /** The kind of chip, which determines its behavior and interaction model. */
  @property({ reflect: true }) kind: ChipKind = 'status';

  /** The chip's theme variant. Only applies to `status` chips. */
  @property({ reflect: true }) variant: ChipVariant = 'neutral';

  /** Whether a `filter` chip is selected. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Disables a `filter` or `input` chip. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** A value associated with the chip, surfaced on the `mh-chip-remove` event. */
  @property() value?: string;

  /** A custom accessible label for the remove button on `input` chips. Defaults to a localized "remove <label>". */
  @property({ attribute: 'remove-label' }) removeLabel?: string;

  get #removeLabel() {
    if (this.removeLabel) return this.removeLabel;
    const label = this.textContent.trim();
    return label
      ? `${this.localize.term('remove')} ${label}`
      : this.localize.term('remove');
  }

  override readonly focus = () => this.el.focus();
  override readonly blur = () => this.el.blur();

  #onFilterClick = () => {
    this.selected = !this.selected;
    this.dispatchEvent(new ChipSelectionChangeEvent(this.selected));
  };

  #requestRemove = () => {
    if (this.disabled) return;
    this.dispatchEvent(new ChipRemoveEvent(this.value));
  };

  #onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      this.#requestRemove();
    }
  };

  override render() {
    switch (this.kind) {
      case 'filter':
        return this.#renderFilter();
      case 'input':
        return this.#renderInput();
      default:
        return renderStatus();
    }
  }

  #renderFilter() {
    return html`
      <button
        part="base"
        type="button"
        aria-pressed=${this.selected ? 'true' : 'false'}
        ?disabled=${this.disabled}
        @click=${this.#onFilterClick}
      >
        <mh-icon
          part="checkmark"
          name="check"
        ></mh-icon>
        <slot
          name="start"
          part="start"
        ></slot>
        <slot part="main"></slot>
      </button>
    `;
  }

  #renderInput() {
    return html`
      <button
        part="base"
        type="button"
        aria-label=${this.#removeLabel}
        ?disabled=${this.disabled}
        @click=${this.#requestRemove}
        @keydown=${this.#onKeyDown}
      >
        <slot
          name="start"
          part="start"
        ></slot>
        <slot part="main"></slot>
        <mh-icon
          part="remove"
          name="close"
        ></mh-icon>
      </button>
    `;
  }
}
