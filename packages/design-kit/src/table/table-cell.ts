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

  override connectedCallback() {
    super.connectedCallback();
    const role = this.header ? 'columnheader' : 'cell';
    this.internals.role = role;
    this.setAttribute('role', role);
  }

  override updated(changed: PropertyValueMap<this>) {
    if (changed.has('header')) {
      const role = this.header ? 'columnheader' : 'cell';
      this.internals.role = role;
      this.setAttribute('role', role);
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}
