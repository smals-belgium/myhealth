import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';

import type { Size } from '../core';
import { cssStateReflect } from '../core/css';
import { LocalizeController } from '../core/i18n';
import { formValueController } from '../form-control';
import size from '../form-control/form-control.size.css?inline';
import {
  getActiveIndex,
  getAllOptions,
  getSelectedLabel,
  numOptions,
  selectedOptionController,
} from '../form-control/option';
import type { IconButton } from '../icon-button';

import { ActivateSelectionEvent } from './activate-selection.event';
import { disabledController } from './disabled.controller';
import styles from './iterator.css?inline';

export type IteratorSize = Extract<Size, 's' | 'm'>;

const getValueAtOffset = (host: HTMLElement, offset: number) =>
  getAllOptions(host).item(getActiveIndex(host) + offset).value;

/**
 * @summary The user can choose form a list of predefined options by cycling through next and previous values.
 * Use only when the user can easily predict what the next/previous value will be without seeing them
 * (e.g. cycling through the months of a year) and the motion range is not very large (i.e. he should not have to
 * cycle for very long to get to the desired value).
 * Can be combined with other selection components through the `mh-activate-selection` event. For example, a month
 * iterator can open a month grid select by clicking the selected month.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/iterator
 * @status experimental
 *
 * @dependency mh-icon-button
 * @dependency mh-option
 *
 * @slot - Default slot contains a list of `mh-option`s. From a DOM perspective, this component works exactly like
 * a regular select.
 *
 * @event mh-activate-selection - Emitted when `interactiveSelection` is true and the selected Option is clicked.
 *
 * @cssstate disabled - Applied when the control is disabled.
 *
 * @cssproperty --mh-iterator__color-fill - The fill colour of the entire component.
 * @cssproperty --mh-iterator__color-fill__disabled - The fill colour of the entire component when disabled.
 * @cssproperty --mh-iterator__size-height - The height of the entire component (matches form-field height).
 */
@customElement('mh-iterator')
export class Iterator extends LitElement {
  static override readonly styles = [styles, size].map(unsafeCSS);
  static formAssociated = true;

  @queryAll('mh-icon-button') navButtons?: NodeListOf<IconButton>;

  @property() override title = '';

  @property({ reflect: true }) size: IteratorSize = 'm';

  @property({ reflect: true }) name?: string;
  @property({ reflect: true }) value?: string | null;

  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({
    type: Boolean,
    reflect: true,
    attribute: 'interactive-selection',
  })
  interactiveSelection = false;

  readonly #localize = new LocalizeController(this);

  // Captures the HTML-declared defaults once; used to restore state on form reset.
  #defaultValue: string | null | undefined;

  constructor() {
    super();
    this.addController(cssStateReflect(this, ['disabled']));
    this.addController(disabledController(this));
    this.addController(formValueController(this));
    this.addController(selectedOptionController(this));
  }

  formResetCallback() {
    this.value = this.#defaultValue ?? null;
  }

  #selectAtOffset(offset: number) {
    this.value = getValueAtOffset(this, offset);
  }

  #disablePrevious = () => this.disabled || getActiveIndex(this) <= 0;
  #disableNext = () =>
    this.disabled || getActiveIndex(this) >= numOptions(this) - 1;

  #selectPrevious = () => this.#selectAtOffset(-1);
  #selectNext = () => this.#selectAtOffset(1);

  // If no Option is selected, automatically select the first one.
  #onDefaultSlotChange() {
    this.value ??= getValueAtOffset(this, 0);
    this.#defaultValue ??= this.value;

    getAllOptions(this).forEach(
      option =>
        (option.role = this.interactiveSelection ? 'button' : 'presentation'),
    );
  }

  #keydownSelection = (event: KeyboardEvent) => {
    if (event.key === 'Enter') this.#activateSelection();
  };

  #activateSelection = () => {
    if (!this.disabled && this.interactiveSelection)
      this.dispatchEvent(new ActivateSelectionEvent(this.value ?? null));
  };

  override render() {
    return html`
      <mh-icon-button
        name="chevron_right"
        part="previous-button"
        appearance="square"
        label=${this.#localize.term('previous')}
        .disabled=${this.#disablePrevious()}
        @click=${this.#selectPrevious}
      ></mh-icon-button>

      <slot
        part="selection"
        role="spinbutton"
        aria-label=${this.title}
        aria-valuemin="0"
        aria-valuemax=${numOptions(this) - 1}
        aria-valuenow=${getActiveIndex(this)}
        aria-valuetext=${getSelectedLabel(this)}
        @click=${this.#activateSelection}
        @keydown=${this.#keydownSelection}
        @slotchange=${this.#onDefaultSlotChange}
      >
      </slot>

      <mh-icon-button
        name="chevron_right"
        part="next-button"
        appearance="square"
        label=${this.#localize.term('next')}
        .disabled=${this.#disableNext()}
        @click=${this.#selectNext}
      ></mh-icon-button>
    `;
  }
}
