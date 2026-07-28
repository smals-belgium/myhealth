import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './table-header-cell.css?inline';

/**
 * @summary A column header cell in an `mh-table`. Slot it into the `header` slot of `mh-table`.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/table
 * @status stable
 * @since 1.0
 *
 * @slot - The header cell content.
 */
@customElement('mh-table-header-cell')
export class TableHeaderCell extends LitElement {
  static override readonly styles = unsafeCSS(styles);
  readonly internals = this.attachInternals();

  /** Sets the element's ARIA role on connection. */
  override connectedCallback() {
    super.connectedCallback();
    // Set both: `internals.role` for modern browsers/AT and the explicit
    // `role` attribute so tooling (axe) and older AT can resolve the
    // row > columnheader ownership relationships.
    this.internals.role = 'columnheader';
    this.setAttribute('role', 'columnheader');
  }

  override render() {
    return html`<slot></slot>`;
  }
}
