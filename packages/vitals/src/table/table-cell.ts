import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './table-cell.css?inline';

/**
 * @summary A single body cell in an `mh-table`. Use `mh-table-header-cell` for column header cells.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/table
 * @status stable
 * @since 1.0
 *
 * @slot - The cell content.
 */
@customElement('mh-table-cell')
export class TableCell extends LitElement {
  static override readonly styles = unsafeCSS(styles);
  readonly internals = this.attachInternals();

  /** Sets the element's ARIA role on connection. */
  override connectedCallback() {
    super.connectedCallback();
    // Set both: `internals.role` for modern browsers/AT and the explicit
    // `role` attribute so tooling (axe) and older AT can resolve the
    // row > cell ownership relationships.
    this.internals.role = 'cell';
    this.setAttribute('role', 'cell');
  }

  override render() {
    return html`<slot></slot>`;
  }
}
