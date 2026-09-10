import { LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';

/**
 * Shared, form-associated behavior for checkbox-like controls (`<mh-checkbox>`,
 * `<mh-selectable-chip>`).
 *
 * A subclass renders a native `<input type="checkbox" part="input">`, wires its `change` event to
 * {@link handleChange}, and exposes the checked state under its own public property name (e.g.
 * `checked` or `selected`) by implementing the {@link checkedState} accessor.
 */
export abstract class CheckboxBase extends LitElement {
  static formAssociated = true;
  readonly internals = this.attachInternals();

  @query('[part="input"]') el?: HTMLInputElement;

  /** The name used when the control participates in a form submission. */
  @property({ reflect: true }) name?: string;

  /** The value submitted with the form when the control is checked. */
  @property({ reflect: true }) value?: string;

  /** Whether the control is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The checked state, exposed publicly by subclasses (e.g. as `checked` or `selected`). */
  protected abstract checkedState: boolean;

  // Captures the HTML-declared default once; used to restore state on form reset.
  #defaultChecked: boolean | undefined;

  override readonly click = () => this.el?.click();
  override readonly focus = () => this.el?.focus();
  override readonly blur = () => this.el?.blur();

  override connectedCallback() {
    super.connectedCallback();
    this.#defaultChecked ??= this.checkedState;
  }

  formResetCallback() {
    this.checkedState = this.#defaultChecked ?? false;
    this.syncFormValue();
  }

  /** Reflects the current checked state into the associated form value. */
  protected syncFormValue() {
    this.internals.setFormValue(
      this.checkedState ? (this.value ?? null) : null,
    );
  }

  /** Handles the native input's `change`: syncs state and form value, then re-emits `change`. */
  protected readonly handleChange = () => {
    if (this.el) this.checkedState = this.el.checked;
    this.syncFormValue();
    this.dispatchEvent(new Event('change', { bubbles: true }));
  };
}
