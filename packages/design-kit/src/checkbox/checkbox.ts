import { LitElement, PropertyValueMap, html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import styles from './checkbox.css?inline';

/**
 * @summary Checkboxes let users toggle an option on or off, or select multiple items from a list. They also support an
 * indeterminate state for partial selections in groups.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/checkbox
 * @status stable
 * @since 1.0
 *
 * @slot - The checklbox' label.
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
@customElement('mh-checkbox')
export class Checkbox extends LitElement {
  static override readonly styles = unsafeCSS(styles);
  static formAssociated = true;
  readonly internals = this.attachInternals();

  @query('[part="input"]') el!: HTMLInputElement;

  @property() override title = '';

  @property({ reflect: true }) name!: string;
  @property({ reflect: true }) value!: string;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * Draws the checkbox in an indeterminate state. This is usually applied to checkboxes that represents a "select
   * all/none" behavior when associated checkboxes have a mix of checked and unchecked states.
   */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  // Captures the HTML-declared defaults once; used to restore state on form reset.
  #defaultChecked: boolean | undefined = undefined;
  #defaultIndeterminate: boolean | undefined = undefined;

  override readonly click = () => this.el.click();
  override readonly focus = () => this.el.focus();
  override readonly blur = () => this.el.blur();

  override connectedCallback() {
    super.connectedCallback();
    this.#defaultChecked ??= this.checked;
    this.#defaultIndeterminate ??= this.indeterminate;
    this.internals.role = 'checkbox';
  }

  formResetCallback() {
    this.checked = this.#defaultChecked ?? false;
    this.indeterminate = this.#defaultIndeterminate ?? false;
    this.internals.setFormValue(this.checked ? this.value : null);
  }

  override updated(changed: PropertyValueMap<this>) {
    if (changed.has('checked') && this.checked)
      this.internals.setFormValue(this.value);
  }

  #onChange() {
    this.checked = this.el.checked;
    this.internals.setFormValue(this.checked ? this.value : null);
  }

  override render() {
    return html`
      <label part="base">
        <input
          part="input"
          type="checkbox"
          title=${this.title}
          name=${ifDefined(this.name)}
          value=${ifDefined(this.value)}
          .checked=${this.checked}
          .disabled=${this.disabled}
          .required=${this.required}
          .indeterminate=${this.indeterminate}
          aria-checked=${this.checked ? 'true' : 'false'}
          @change=${this.#onChange}
        />
        <slot part="label"></slot>
      </label>
    `;
  }
}
