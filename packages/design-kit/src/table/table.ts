import { LitElement, PropertyValueMap, html, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import type { Checkbox } from '../checkbox';

import { SelectionChangeEvent } from './selection-change.event';
import type { TableRow } from './table-row';
import styles from './table.css?inline';

/**
 * @summary A data table with optional row selection and row expansion.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/table
 * @status stable
 * @since 1.0
 *
 * @slot header - Column header cells (`mh-table-cell` elements with the `header` attribute).
 * @slot - Body rows (`mh-table-row` elements).
 *
 * @event {SelectionChangeEvent} mh-table-selection-change - Fired when row selection changes.
 *
 * @csspart head - The table header group (`display: table-header-group`).
 * @csspart header-row - The header row container.
 * @csspart select-all-cell - The leading header cell containing the select-all checkbox.
 * @csspart select-all - The select-all checkbox (`mh-checkbox`).
 * @csspart body - The table body group (`display: table-row-group`).
 *
 * @dependency mh-checkbox
 */
@customElement('mh-table')
export class Table extends LitElement {
  static override readonly styles = unsafeCSS(styles);
  readonly internals = this.attachInternals();

  @query('[part="select-all"]') private selectAllCheckbox?: Checkbox;

  @state() private hasExpandableRows = false;

  #observer!: MutationObserver;

  #onRowChange = () => {
    this.#updateSelectAll();
    this.dispatchEvent(new SelectionChangeEvent(this.selected));
  };

  /** When set, all body rows show a selection checkbox and a select-all checkbox appears in the header. */
  @property({ type: Boolean, reflect: true }) selectable = false;

  /** Accessible label for the table (`aria-label`). */
  @property() caption = '';

  /** Returns the `value` of every currently selected (and non-empty) body row. */
  get selected(): string[] {
    return this.#getBodyRows()
      .filter(row => row.selected)
      .map(row => row.value)
      .filter(value => value !== '');
  }

  override connectedCallback() {
    super.connectedCallback();
    this.internals.role = 'table';
    this.setAttribute('role', 'table');
    if (this.caption) this.internals.ariaLabel = this.caption;

    this.#propagateSelectable();
    this.#updateExpandableState();

    this.#observer = new MutationObserver(() => {
      this.#propagateSelectable();
      this.#updateSelectAll();
      this.#updateExpandableState();
    });
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['expandable'],
    });

    this.addEventListener('change', this.#onRowChange);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer.disconnect();
    this.removeEventListener('change', this.#onRowChange);
  }

  override updated(changed: PropertyValueMap<this>) {
    if (changed.has('selectable')) {
      this.#propagateSelectable();
      this.#propagateShowControl();
    }
    if (changed.has('caption') && this.caption)
      this.internals.ariaLabel = this.caption;
  }

  #updateExpandableState() {
    this.hasExpandableRows =
      this.querySelector('mh-table-row[expandable]') !== null;
    this.toggleAttribute('has-expandable-rows', this.hasExpandableRows);
    this.#propagateShowControl();
  }

  #propagateShowControl() {
    const showControl = this.selectable || this.hasExpandableRows;
    for (const row of this.#getBodyRows()) row.showControl = showControl;
  }

  #getBodyRows(): TableRow[] {
    return Array.from(this.querySelectorAll<TableRow>('mh-table-row'));
  }

  #propagateSelectable() {
    for (const row of this.#getBodyRows()) row.selectable = this.selectable;
  }

  #updateSelectAll() {
    if (!this.selectable) return;
    const cb = this.selectAllCheckbox;
    if (!cb) return;
    const enabled = this.#getBodyRows().filter(row => !row.disabled);
    const selected = enabled.filter(row => row.selected);
    const allSelected =
      selected.length === enabled.length && enabled.length > 0;
    const noneSelected = selected.length === 0;
    cb.checked = allSelected;
    cb.indeterminate = !noneSelected && !allSelected;
  }

  #onSelectAll(event: Event) {
    const checkbox = event.currentTarget as Checkbox;
    const { checked } = checkbox;
    const rows = this.#getBodyRows().filter(row => !row.disabled);
    for (const row of rows) row.selected = checked;
    checkbox.indeterminate = false;
    this.dispatchEvent(new SelectionChangeEvent(this.selected));
  }

  override render() {
    return html`
      <div
        part="head"
        role="rowgroup"
      >
        <div
          part="header-row"
          role="row"
        >
          ${this.selectable || this.hasExpandableRows
            ? html`<mh-table-cell
                header
                part="select-all-cell"
              >
                ${this.selectable
                  ? html`<mh-checkbox
                      part="select-all"
                      aria-label="Select all rows"
                      @change=${this.#onSelectAll}
                    ></mh-checkbox>`
                  : nothing}
              </mh-table-cell>`
            : nothing}
          <slot name="header"></slot>
        </div>
      </div>
      <div
        part="body"
        role="rowgroup"
      >
        <slot></slot>
      </div>
    `;
  }
}
