import { PropertyValueMap, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { CheckboxBase } from './checkbox-base';
import styles from './checkbox.css?inline';

/**
 * @summary Checkboxes let users toggle an option on or off, or select multiple items from a list. They also support an
 * indeterminate state for partial selections in groups.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/checkbox
 * @status stable
 * @since 1.0
 *
 * @slot - The checkbox' label.
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
export class Checkbox extends CheckboxBase {
  static override readonly styles = unsafeCSS(styles);

  @property() override title = '';

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * Draws the checkbox in an indeterminate state. This is usually applied to checkboxes that represents a "select
   * all/none" behavior when associated checkboxes have a mix of checked and unchecked states.
   */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  // Captures the HTML-declared default once; used to restore state on form reset.
  #defaultIndeterminate: boolean | undefined;

  protected get checkedState() {
    return this.checked;
  }
  protected set checkedState(value: boolean) {
    this.checked = value;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.#defaultIndeterminate ??= this.indeterminate;
  }

  override formResetCallback() {
    super.formResetCallback();
    this.indeterminate = this.#defaultIndeterminate ?? false;
  }

  override updated(changed: PropertyValueMap<this>) {
    if (changed.has('checked') && this.checked) this.syncFormValue();
  }

  override render() {
    return html`
      <label part="base">
        <input
          part="input"
          type="checkbox"
          title=${this.title}
          name=${ifDefined(this.name)}
          .value=${ifDefined(this.value)}
          .checked=${this.checked}
          .disabled=${this.disabled}
          .required=${this.required}
          .indeterminate=${this.indeterminate}
          aria-checked=${this.checked ? 'true' : 'false'}
          @change=${this.handleChange}
        />
        <slot part="label"></slot>
      </label>
    `;
  }
}
