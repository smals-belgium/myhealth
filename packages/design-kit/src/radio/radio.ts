import { LitElement, PropertyValueMap, html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { radioGroups } from './radio-groups';
import styles from './radio.css?inline';

/**
 * @summary Radios represent a single option within a mutually exclusive set. Use them inside a radio group when users
 *  must pick exactly one choice from a small list.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/radio
 * @status stable
 * @since 1.0
 *
 * @slot - The radio's label.
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
@customElement('mh-radio')
export class Radio extends LitElement {
  static override readonly styles = unsafeCSS(styles);
  static formAssociated = true;
  readonly internals = this.attachInternals();

  @query('[part="input"]') el?: HTMLInputElement;

  @property() override title = '';

  @property({ reflect: true }) name!: string;
  @property({ reflect: true }) value!: string;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;

  // Captures the HTML-declared default once; used to restore state on form reset.
  #defaultChecked: boolean | undefined;

  override readonly click = () => this.el?.click();
  override readonly focus = () => this.el?.focus();
  override readonly blur = () => this.el?.blur();

  override connectedCallback() {
    super.connectedCallback();
    this.#defaultChecked ??= this.checked;
    this.internals.role = 'radio';
    radioGroups.connect(this);
  }

  protected formResetCallback() {
    radioGroups.reset(this, this.#defaultChecked ?? false);
  }

  override disconnectedCallback() {
    radioGroups.disconnect(this);
    super.disconnectedCallback();
  }

  override updated(changed: PropertyValueMap<this>) {
    if (changed.has('checked') && this.checked) radioGroups.updateValue(this);
  }

  #onChange() {
    if (this.el?.checked) radioGroups.updateValue(this);
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  override render() {
    return html`
      <label part="base">
        <input
          part="input"
          type="radio"
          title=${this.title}
          name=${ifDefined(this.name)}
          .value=${ifDefined(this.value)}
          .checked=${this.checked}
          .disabled=${this.disabled}
          .required=${this.required}
          aria-checked=${this.checked ? 'true' : 'false'}
          @change=${this.#onChange}
        />
        <slot part="label"></slot>
      </label>
    `;
  }
}
