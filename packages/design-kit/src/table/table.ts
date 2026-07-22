import { LitElement, PropertyValueMap, html, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import type { Checkbox } from '../checkbox';
import { LocalizeController } from '../core/i18n';

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
 * @csspart table - The inner table container (`display: table`) wrapping the head and body.
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

  private readonly localize = new LocalizeController(this);

  @query('[part="select-all"]') private selectAllCheckbox?: Checkbox;

  @state() private hasExpandableRows = false;

  #observer!: MutationObserver;

  /** Handles `change` events bubbling from body rows; refreshes the select-all checkbox state and emits `SelectionChangeEvent`. */
  #onRowChange = () => {
    this.#updateSelectAll();
    this.dispatchEvent(new SelectionChangeEvent(this.selected));
  };

  /** When set, all body rows show a selection checkbox and a select-all checkbox appears in the header. */
  @property({ type: Boolean, reflect: true }) selectable = false;

  /** Accessible label for the table, exposed as `aria-label` (there is no visible caption). */
  @property() caption = '';

  /** Returns the `value` of every currently selected (and non-empty) body row. */
  get selected(): string[] {
    return this.#getBodyRows()
      .filter(row => row.selected)
      .map(row => row.value)
      .filter(value => value !== '');
  }

  /** Sets the element's ARIA role and label, seeds initial row state, and wires up the mutation observer and row-change listener. */
  override connectedCallback() {
    super.connectedCallback();
    // Set both: `internals.role` for modern browsers/AT and the explicit
    // `role` attribute so tooling (axe) and older AT can resolve the
    // table > row > cell ownership relationships.
    this.internals.role = 'table';
    this.setAttribute('role', 'table');
    if (this.caption) this.internals.ariaLabel = this.caption;

    this.#propagateSelectable();
    this.#updateExpandableState();
    this.#observeMutations();

    this.addEventListener('change', this.#onRowChange);
  }

  /** Creates and starts the `MutationObserver` that re-syncs state when body rows are added, removed, or their `expandable` attribute changes. */
  #observeMutations() {
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
  }

  /** Disconnects the mutation observer and removes the row-change listener. */
  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer.disconnect();
    this.removeEventListener('change', this.#onRowChange);
  }

  /** Re-propagates `selectable` to body rows and keeps `aria-label` in sync when `caption` or `selectable` changes. */
  override updated(changed: PropertyValueMap<this>) {
    if (changed.has('selectable')) {
      this.#propagateSelectable();
      this.#propagateShowControl();
    }
    if (changed.has('caption')) this.internals.ariaLabel = this.caption || null;
  }

  /** Detects whether any body row carries the `expandable` attribute, updates the `has-expandable-rows` host attribute, and refreshes each row's `show-control` flag. */
  #updateExpandableState() {
    this.hasExpandableRows =
      this.querySelector('mh-table-row[expandable]') !== null;
    this.toggleAttribute('has-expandable-rows', this.hasExpandableRows);
    this.#propagateShowControl();
  }

  /** Writes the `show-control` flag to every body row so each row renders an aligned leading cell even when it is not itself selectable or expandable. */
  #propagateShowControl() {
    const showControl = this.selectable || this.hasExpandableRows;
    for (const row of this.#getBodyRows()) row.showControl = showControl;
  }

  /** Returns all `mh-table-row` descendant elements as an array. */
  #getBodyRows(): TableRow[] {
    return Array.from(this.querySelectorAll<TableRow>('mh-table-row'));
  }

  /** Copies the table's `selectable` property down to every body row. */
  #propagateSelectable() {
    for (const row of this.#getBodyRows()) row.selectable = this.selectable;
  }

  /** Syncs the select-all checkbox to reflect whether all, some, or no enabled rows are currently selected. */
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

  /** Handles the select-all checkbox `change` event; selects or deselects all enabled body rows and emits `SelectionChangeEvent`. */
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
        part="table"
        role="presentation"
      >
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
                        aria-label=${this.localize.term('selectAllRows')}
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
      </div>
    `;
  }
}
