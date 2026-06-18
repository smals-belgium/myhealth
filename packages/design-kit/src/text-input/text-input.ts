import { LitElement, PropertyValueMap, html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import size from '../form-control/form-control.size.css?inline';

import iconButtonSlot from './text-input-icon-button.slot.css?inline';
import iconSlot from './text-input-icon.slot.css?inline';
import styles from './text-input.css?inline';
import vars from './text-input.vars.css?inline';

/** HTMLInputElement['type'] is `string`, so we narrow it down. */
export type TextInputType =
  | 'email'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'url';

/** Controls whether and how text input is automatically capitalized as it is entered by the user. */
export type AutoCapitalize =
  | 'off'
  | 'none'
  | 'on'
  | 'sentences'
  | 'words'
  | 'characters';

/** Used to customize the label or icon of the Enter key on virtual keyboards. */
export type EnterKeyHint =
  | 'enter'
  | 'done'
  | 'go'
  | 'next'
  | 'previous'
  | 'search'
  | 'send';

/**
 * Tells the browser what type of data will be entered by the user, allowing it to display the appropriate virtual
 * keyboard on supportive devices.
 */
export type InputMode =
  | 'none'
  | 'text'
  | 'decimal'
  | 'numeric'
  | 'tel'
  | 'search'
  | 'email'
  | 'url';

/**
 * @summary Checkboxes let users toggle an option on or off, or select multiple items from a list. They also support an
 * indeterminate state for partial selections in groups.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/checkbox
 * @status stable
 * @since 1.0
 *
 * @slot - The input label.
 *
 * @event blur - Emitted when the control loses focus.
 * @event focus - Emitted when the control gains focus.
 *
 * @csspart base - The native `label` that wraps the `input`.
 * @csspart label - The actual label content.
 * @csspart input - The native radio input.
 *
 * @cssstate checked - Applied when the control is checked.
 * @cssstate disabled - Applied when the control is disabled.
 * @cssstate invalid - Applied when the control is invalid.
 */
@customElement('mh-text-input')
export class TextInput extends LitElement {
  static override readonly styles = [
    vars,
    styles,
    size,
    iconSlot,
    iconButtonSlot,
  ].map(unsafeCSS);
  static formAssociated = true;
  readonly internals = this.attachInternals();

  @query('[part="input"]') el!: HTMLInputElement;

  @property() override title = '';
  @property() type: TextInputType = 'text';

  @property({ reflect: true }) size: 'm' | 's' = 'm';

  @property({ reflect: true }) name!: string;
  @property({ reflect: true }) value!: string | null;

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
  #defaultValue: string | null | undefined = undefined;

  override readonly click = () => this.el.click();
  override readonly focus = () => this.el.focus();
  override readonly blur = () => this.el.blur();

  override connectedCallback() {
    super.connectedCallback();
    this.#defaultValue ??= this.value;
    this.internals.role = 'checkbox';
  }

  formResetCallback() {
    this.value = this.#defaultValue ?? null;
    this.internals.setFormValue(this.value);
  }

  override updated(changed: PropertyValueMap<this>) {
    if (changed.has('value')) this.internals.setFormValue(this.value);

    // propagate disabled state to all slotted elements that can be disabled
    if (changed.has('disabled'))
      Array.from(this.renderRoot.querySelectorAll<HTMLSlotElement>('slot'))
        .flatMap(slot => slot.assignedElements({ flatten: true }))
        .filter(el => 'disabled' in el)
        .forEach(el => (el.disabled = this.disabled));
  }

  #onChange() {
    this.internals.setFormValue(this.el.value);
  }

  override render() {
    return html`
      <label part="base">
        <slot part="label"></slot>

        <div
          id="help"
          part="help"
        >
          ${this.help}
        </div>

        <div part="input-container">
          <slot
            name="start"
            part="start"
          ></slot>

          <input
            id="input"
            part="input"
            type="${this.type}"
            title=${this.title}
            name=${ifDefined(this.name)}
            value=${ifDefined(this.value)}
            .disabled=${this.disabled}
            .required=${this.required}
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
            @change=${this.#onChange}
          />

          <slot
            name="end"
            part="end"
          ></slot>
        </div>
      </label>

      <div
        id="hint"
        part="hint"
      >
        ${this.hint}
      </div>
    `;
  }
}
