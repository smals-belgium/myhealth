import { LitElement, html } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { Size } from '../core';
import { cssStateReflect } from '../core/css';
import { formValueController } from '../form-control';
import { renderFormField } from '../form-control/form-field';

import { disabledController } from './disabled.controller';
import { textInputStyles } from './text-input.styles';

/** HTMLInputElement['type'] is `string`, so we narrow it down. */
export type TextInputType =
  'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

export type TextInputSize = Extract<Size, 's' | 'm'>;

/** Controls whether and how text input is automatically capitalized as it is entered by the user. */
export type AutoCapitalize =
  'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';

/** Used to customize the label or icon of the Enter key on virtual keyboards. */
export type EnterKeyHint =
  'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';

/**
 * Tells the browser what type of data will be entered by the user, allowing it to display the appropriate virtual
 * keyboard on supportive devices.
 */
export type InputMode =
  'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

/**
 * @summary Text inputs collect single-line data from the user, such as text, email addresses, and passwords.
 * Number inputs are excluded from this list; they have their own dedicated component in Vitals.
 * Supports labels, hints, validation, and start or end slots.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/text-input
 * @status stable
 * @since 1.0
 *
 * @slot - The input label
 * @slot start - An element, such as `<mh-icon>`, placed before the text input.
 * @slot end - An element, such as `<mh-icon>`, placed after the text input.
 * @slot help - The form-field help label.
 * @slot hint - The form-field hint label.
 *
 * @event blur - Emitted when the control loses focus.
 * @event focus - Emitted when the control gains focus.
 *
 * @csspart base - The native `label` that wraps the `input`.
 * @csspart label - The actual label content
 * @csspart help - The actual help description content.
 * @csspart hint - The actual hint description content.
 * @csspart input-container - The wrapper that contains all input elements.
 * @csspart start - Left side of the input container.
 * @csspart input - The actual native input element.
 * @csspart end - Right side of the input container.
 *
 * @cssstate disabled - Applied when the control is disabled.
 * @cssstate invalid - Applied when the control is invalid.
 *
 * @cssproperty [--mh-text-input__color-type-input=var(--mh-color-neutral-type-louder)] - The text color of the input field.
 * @cssproperty [--mh-text-input__color-type-icon=var(--mh-color-neutral-type-loud)] - The color of decorative icons in the input.
 * @cssproperty [--mh-text-input__color-type-icon-button=var(--mh-color-brand-type)] - The color of icon buttons inside the input.
 * @cssproperty [--mh-text-input__color-type-icon-button__hover=var(--mh-color-brand-type-loud)] - The color of icon buttons on hover.
 * @cssproperty [--mh-text-input__color-type-icon-button__active=var(--mh-color-brand-type-louder)] - The color of icon buttons when pressed.
 * @cssproperty [--mh-text-input__color-fill-input=#ffffff] - The background color of the input field.
 * @cssproperty [--mh-text-input__color-fill-input__disabled=#ffffff] - The background color when disabled.
 * @cssproperty [--mh-text-input__color-border-input=var(--mh-color-neutral-border)] - The border color of the input field.
 * @cssproperty [--mh-text-input__color-border-input__hover=var(--mh-color-brand-border)] - The border color on hover.
 * @cssproperty [--mh-text-input__color-border-input__focus=var(--mh-color-brand-border-loud)] - The border color when focused.
 * @cssproperty [--mh-text-input__color-border-input__invalid=var(--mh-color-danger-border)] - The border color when invalid.
 * @cssproperty --mh-text-input__color-border-input__invalid-hover - The border color when invalid and hovered.
 * @cssproperty [--mh-text-input__size-height=var(--mh-form-control-height)] - The height of the input field.
 * @cssproperty [--mh-text-input__size-border-radius=var(--mh-border-radius)] - The border radius of the input field.
 *
 * @cssproperty [--mh-form-field__color-type-label=var(--mh-color-neutral-type-louder)] - The color of the field label.
 * @cssproperty [--mh-form-field__color-type-help=var(--mh-color-neutral-type-loud)] - The color of the help text.
 * @cssproperty [--mh-form-field__color-type-hint=var(--mh-color-neutral-type)] - The color of the hint text.
 * @cssproperty [--mh-form-field__color-type-required-symbol=var(--mh-color-danger-type)] - The color of the required `*` symbol.
 * @cssproperty [--mh-form-field__color-type__disabled=var(--mh-color-neutral-type)] - The label and hint color when disabled.
 */
@customElement('mh-text-input')
export class TextInput extends LitElement {
  static override readonly styles = textInputStyles;
  static formAssociated = true;

  @query('[part="input"]') el?: HTMLInputElement;
  @queryAll('slot') slots?: NodeListOf<HTMLSlotElement>;

  @property() override title = '';
  @property() type: TextInputType = 'text';

  @property({ reflect: true }) size: TextInputSize = 'm';

  @property({ reflect: true }) name?: string;
  @property({ reflect: true }) value?: string | null;

  @property({ reflect: true }) placeholder?: string;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;

  /** A regular expression pattern to validate input against. */
  @property() pattern?: string;

  /** The minimum length of input that will be considered valid. */
  @property({ type: Number }) minlength?: number;

  /** The maximum length of input that will be considered valid. */
  @property({ type: Number }) maxlength?: number;

  @property() override autocapitalize: AutoCapitalize = 'off';

  /**
   * Specifies what permission the browser has to provide assistance in filling out form field values. Refer to
   * [this page on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for available values.
   */
  @property() autocomplete?: string;

  /** Indicates that the input should receive focus on page load. */
  @property({ type: Boolean }) override autofocus = false;

  /** Enables spell checking on the input. */
  @property({ type: Boolean }) override spellcheck = true;

  @property() enterkeyhint?: EnterKeyHint;
  @property() inputmode?: InputMode;

  @property({ reflect: true }) help?: string;
  @property({ reflect: true }) hint?: string;

  // Captures the HTML-declared defaults once; used to restore state on form reset.
  #defaultValue: string | null | undefined;

  override readonly click = () => this.el?.click();
  override readonly focus = () => this.el?.focus();
  override readonly blur = () => this.el?.blur();

  override connectedCallback() {
    super.connectedCallback();
    this.addController(cssStateReflect(this, ['disabled', 'required']));
    this.addController(disabledController(this));
    this.addController(formValueController(this));
    this.#defaultValue ??= this.value;
  }

  formResetCallback() {
    this.value = this.#defaultValue ?? null;
  }

  #onInput = () => (this.value = this.el?.value);

  #onChange() {
    if (this.el) this.value = this.el.value;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #renderInput = () => html`
    <div part="input-container">
      <slot
        name="start"
        part="start"
      ></slot>

      <input
        id="input"
        part="input"
        type=${this.type}
        title=${this.title}
        name=${ifDefined(this.name)}
        placeholder=${ifDefined(this.placeholder)}
        minlength=${ifDefined(this.minlength)}
        maxlength=${ifDefined(this.maxlength)}
        pattern=${ifDefined(this.pattern)}
        autocapitalize=${this.autocapitalize}
        autocomplete=${ifDefined(this.autocomplete)}
        spellcheck=${this.spellcheck}
        ?autocorrect=${this.autocorrect}
        ?autofocus=${this.autofocus}
        enterkeyhint=${ifDefined(this.enterkeyhint)}
        inputmode=${ifDefined(this.inputmode)}
        aria-describedby="help hint"
        .disabled=${this.disabled}
        .required=${this.required}
        .value=${this.value ?? ''}
        @change=${this.#onChange}
        @input=${this.#onInput}
      />

      <slot
        name="end"
        part="end"
      ></slot>
    </div>
  `;

  override render() {
    return renderFormField({
      host: this,
      renderInput: this.#renderInput,
    });
  }
}
