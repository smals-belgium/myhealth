import { LitElement, PropertyValueMap, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './table-cell.css?inline';

/**
 * @summary A single cell in an `mh-table`. Use the `header` attribute to render a column header cell.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/table
 * @status stable
 * @since 1.0
 *
 * @slot - The cell content.
 */
@customElement('mh-table-cell')
export class TableCell extends LitElement {
  static override readonly styles = unsafeCSS(styles);
  readonly internals = this.attachInternals();

  /**
   * When set, this cell acts as a column header (`role="columnheader"`).
   * @attr header
   */
  @property({ type: Boolean, reflect: true }) header = false;

  /** Applies the initial ARIA `role` attribute on connection. */
  override connectedCallback() {
    super.connectedCallback();
    this.#applyRole();
  }

  /** Re-applies the ARIA `role` attribute when the `header` property changes. */
  override updated(changed: PropertyValueMap<this>) {
    if (changed.has('header')) this.#applyRole();
  }

  /** Sets both `internals.role` and the reflected `role` attribute to `columnheader` or `cell` based on the `header` property. */
  #applyRole() {
    // Set both: `internals.role` for modern browsers/AT and the explicit
    // `role` attribute so tooling (axe) and older AT can resolve the
    // row > cell/columnheader ownership relationships.
    const role = this.header ? 'columnheader' : 'cell';
    this.internals.role = role;
    this.setAttribute('role', role);
  }

  override render() {
    return html`<slot></slot>`;
  }
}
