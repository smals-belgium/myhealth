import { PropertyValueMap, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { CheckboxBase } from '../checkbox';

import styles from './chip.css?inline';
import selectableStyles from './selectable-chip.css?inline';

/**
 * @summary Selectable chips act as filter toggles. Functionally a styled checkbox — they are
 * form-bindable and surface the native `change` event.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/chip
 * @status stable
 * @since 1.0
 *
 * @event change - Emitted when the chip is selected or deselected.
 *
 * @slot - The chip's label.
 * @slot start - An element, such as `<mh-icon>`, placed before the label.
 *
 * @csspart base - The component's base wrapper (`<label>`).
 * @csspart input - The native checkbox input (renders the animated checkmark).
 * @csspart start - The container that wraps the `start` slot.
 * @csspart main - The container that wraps the label.
 *
 * @cssproperty [--mh-chip__size-height=2rem] - The chip's minimum height.
 * @cssproperty [--mh-chip__color-type=var(--mh-color-neutral-type)] - The chip's text color.
 */
@customElement('mh-selectable-chip')
export class SelectableChip extends CheckboxBase {
  static override readonly styles = [styles, selectableStyles].map(unsafeCSS);

  /** Whether the chip is selected. */
  @property({ type: Boolean, reflect: true }) selected = false;

  protected get checkedState() {
    return this.selected;
  }
  protected set checkedState(value: boolean) {
    this.selected = value;
  }

  override updated(changed: PropertyValueMap<this>) {
    if (changed.has('selected') && this.selected) this.syncFormValue();
  }

  override render() {
    return html`
      <label part="base">
        <input
          part="input"
          type="checkbox"
          name=${ifDefined(this.name)}
          .value=${this.value ?? ''}
          .checked=${this.selected}
          .disabled=${this.disabled}
          @change=${this.handleChange}
        />
        <slot part="main"></slot>
      </label>
    `;
  }
}
