import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import type { Size } from '../core';
import { getInternals } from '../core/internals';
import { openCloseBehaviour } from '../core/open-close.behaviour';
import { renderFormField } from '../form-control/form-field';
import {
  activateAt,
  commitActiveValue,
  getOptionIndex,
  getSelectedLabel,
  getSelectedOption,
} from '../form-control/option';

import { onOptionEvent } from './option-event.directive';
import { selectControllers } from './select.controller';
import { selectStyles } from './select.styles';

export type SelectSize = Extract<Size, 's' | 'm'>;

/**
 * @summary Selects let users choose one or more values from a dropdown list of predefined options. Use them in forms
 * when a fixed set of choices needs to fit in limited space.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/select
 * @status stable
 * @since 1.0
 *
 * @dependency mh-icon
 * @dependency mh-option
 *
 * @slot - Default slot contains a list of `mh-option`s. If it also contains plain text, this will be moved to the
 * label slot. If you need a more complex label, use the `label` slot instead.
 * @slot start - An element, such as `<mh-icon>`, placed before the toggle-button label.
 * @slot end - An element, such as `<mh-icon>`, placed after the toggle-button label.
 * @slot label - The form-field input label.
 * @slot help - The form-field help label.
 * @slot hint - The form-field hint label.
 *
 * @event blur - Emitted when the control loses focus.
 * @event focus - Emitted when the contGol gains focus.
 *
 * @csspart base - The native `label` that wraps the `select`.
 * @csspart label - The actual label content.
 * @csspart help - The actual help description content.
 * @csspart hint - The actual hint description content.
 * @csspart toggle-button - The button you click to open the dropdown.
 * @csspart start - Left side of the toggle button.
 * @csspart selected-label - The label displayed in the toggle-button; either a placeholder or an actual value label.
 * @csspart end - Right side of the toggle button.
 * @csspart listbox - The box with a list of `mh-option`s that is displayed when the toggle-button is clicked.
 *
 * @cssstate placeholder-shown - Applied when the component has no selected value.
 * @cssstate open - Applied when the popover is displayed.
 * @cssstate required - Applied when the control is required.
 * @cssstate disabled - Applied when the control is disabled.
 * @cssstate invalid - Applied when the control is invalid.
 *
 * @cssproperty [--mh-select__color-chevron=var(--mh-color-brand-type)] - The color of the dropdown chevron icon.
 * @cssproperty [--mh-select__color-border-input=var(--mh-color-neutral-border)] - The border color of the select button.
 * @cssproperty [--mh-select__color-border-input__hover=var(--mh-color-brand-border)] - The border color on hover.
 * @cssproperty [--mh-select__color-border-input__focus=var(--mh-color-brand-border-loud)] - The border color when focused.
 * @cssproperty [--mh-select__color-border-input__invalid=var(--mh-color-danger-border)] - The border color when invalid.
 * @cssproperty --mh-select__color-border-input__invalid-hover - The border color when invalid and hovered.
 * @cssproperty --mh-select__color-fill-input - The background color of the select button.
 * @cssproperty [--mh-select__box-shadow-listbox=0px 3px 10px 0px rgba(0,0,0,0.15)] - The shadow of the dropdown listbox.
 * @cssproperty [--mh-select__size-height=var(--mh-form-control-height)] - The height of the select button.
 * @cssproperty [--mh-select__size-border-radius=var(--mh-border-radius)] - The border radius of the select button.
 *
 * @cssproperty [--mh-form-field__color-type-label=var(--mh-color-neutral-type-louder)] - The color of the field label.
 * @cssproperty [--mh-form-field__color-type-help=var(--mh-color-neutral-type-loud)] - The color of the help text.
 * @cssproperty [--mh-form-field__color-type-hint=var(--mh-color-neutral-type)] - The color of the hint text.
 * @cssproperty [--mh-form-field__color-type-required-symbol=var(--mh-color-danger-type)] - The color of the required `*` symbol.
 * @cssproperty [--mh-form-field__color-type__disabled=var(--mh-color-neutral-type)] - The label and hint color when disabled.
 */
@customElement('mh-select')
export class Select extends LitElement {
  static override readonly styles = selectStyles;
  static formAssociated = true;

  @query('[part="toggle-button"]') el?: HTMLInputElement;
  @query('[part="label"]') label?: HTMLElement;
  @query('[part="listbox"]') listbox?: HTMLElement;

  @property() override title = '';

  @property({ reflect: true }) size: SelectSize = 'm';

  @property({ reflect: true }) name?: string;
  @property({ reflect: true }) value?: string | null;

  @property({ reflect: true }) placeholder?: string;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;

  @property({ reflect: true }) help?: string;
  @property({ reflect: true }) hint?: string;

  /**
   * Indicates whether or not the select is open. You can toggle this attribute to show and hide the menu, or you can
   * use the `toggle()` method and this attribute will reflect the select's open state.
   */
  @property({ type: Boolean, reflect: true }) open = false;

  // TBD
  multiple = false;

  #openClose = openCloseBehaviour(this);

  /** Programmatically open or close the select's listbox. */
  readonly toggle = this.#openClose.toggle;

  // Captures the HTML-declared defaults once; used to restore state on form reset.
  #defaultValue: string | null | undefined;

  override readonly click = () => this.el?.click();
  override readonly focus = () => this.el?.focus();
  override readonly blur = () => this.el?.blur();

  constructor() {
    super();
    selectControllers(this);
    getInternals(this).role = 'combobox';
  }

  formResetCallback() {
    this.value = this.#defaultValue ?? null;
  }

  #handleDefaultSlotChange() {
    this.value = getSelectedOption(this)?.value;
    this.#defaultValue ??= this.value;

    const textNodes = Array.from(this.childNodes).filter(
      node => node.nodeType === Node.TEXT_NODE,
    );

    const labelText = textNodes
      .map(node => node.textContent?.trim())
      .join('')
      .trim();

    if (this.label && labelText) {
      this.label.innerText = labelText;
      textNodes.forEach(node => node.remove());
    }
  }

  #activateHoveredOption = onOptionEvent(option =>
    activateAt(this, getOptionIndex(this, option)),
  );
  #commitActiveOption = onOptionEvent(() => commitActiveValue(this));

  #renderToggleButton = () => html`
    <button
      required
      part="toggle-button"
      popovertarget="listbox"
      ?disabled=${this.disabled}
    >
      <slot
        name="start"
        part="start"
      ></slot>

      <span part="selected-label">${getSelectedLabel(this)}</span>

      <slot
        name="end"
        part="end"
      ></slot>

      <mh-icon name="chevron_right"></mh-icon>
    </button>
  `;

  #renderListbox = () => html`
    <div
      id="listbox"
      part="listbox"
      role="listbox"
      popover
      aria-expanded=${this.open ? 'true' : 'false'}
      aria-multiselectable=${this.multiple ? 'true' : 'false'}
      aria-labelledby="label"
      tabindex="-1"
      @mousemove=${this.#activateHoveredOption}
      @mouseup=${this.#commitActiveOption}
      @toggle=${this.#openClose.onToggle}
    >
      <slot @slotchange=${this.#handleDefaultSlotChange}></slot>
    </div>
  `;

  override render() {
    return renderFormField({
      host: this,
      renderInput: this.#renderToggleButton,
      renderExtra: this.#renderListbox,
    });
  }
}
