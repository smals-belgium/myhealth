import { LitElement, PropertyValueMap, html, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import type { Checkbox } from '../checkbox';
import { LocalizeController } from '../core/i18n';

import { SelectionChangeEvent } from './selection-change.event';
import type { SelectionMode } from './selection-mode';
import type { TableRow } from './table-row';
import styles from './table.css?inline';

let instanceId = 0;
/** Returns a unique, stable `name` shared by every row's radio button in `single` selection mode, so they form one mutually-exclusive group. */
const nextSelectionGroupName = (): string => {
  const id = instanceId;
  instanceId += 1;
  return `mh-table-selection-${String(id)}`;
};

/**
 * @summary A data table with optional row selection and row expansion.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/table
 * @status experimental
 * @since 1.0
 *
 * @slot header - Column header cells (`mh-table-header-cell` elements).
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
 * @dependency mh-table-header-cell
 */
@customElement('mh-table')
export class Table extends LitElement {
  static override readonly styles = unsafeCSS(styles);
  readonly internals = this.attachInternals();

  private readonly localize = new LocalizeController(this);

  @query('[part="select-all"]') private selectAllCheckbox?: Checkbox;

  @state() private hasExpandableRows = false;

  readonly #selectionGroupName = nextSelectionGroupName();

  #observer!: MutationObserver;

  /**
   * Handles `change` events bubbling from body rows. In `single` selection
   * mode, enforces exclusivity by deselecting every other row whenever a row
   * becomes selected — this covers both a direct radio click (already
   * exclusive at the DOM level via the shared radio group) and a click
   * anywhere else on the row (which selects the row directly, bypassing the
   * radio group). Also refreshes the select-all checkbox state and emits
   * `SelectionChangeEvent`.
   */
  #onRowChange = (event: Event) => {
    if (this.selectionMode === 'single') {
      const changedRow = event.target as TableRow;
      if (changedRow.selected)
        for (const row of this.#getBodyRows())
          if (row !== changedRow) row.selected = false;
    }
    this.#updateSelectAll();
    this.dispatchEvent(new SelectionChangeEvent(this.selected));
  };

  /**
   * Controls row selection:
   * - `none` (default) — rows cannot be selected.
   * - `single` — at most one row can be selected, via a radio button per row.
   * - `multi` — any number of rows can be selected, via a checkbox per row and a select-all checkbox in the header.
   */
  @property({ reflect: true, attribute: 'selection-mode' })
  selectionMode: SelectionMode = 'none';

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

    this.#propagateSelectionMode();
    this.#updateExpandableState();
    this.#observeMutations();

    this.addEventListener('change', this.#onRowChange);
  }

  /** Creates and starts the `MutationObserver` that re-syncs state when body rows are added, removed, or their `expandable` attribute changes. */
  #observeMutations() {
    this.#observer = new MutationObserver(() => {
      this.#propagateSelectionMode();
      this.#updateSelectAll();
      this.#updateExpandableState();
    });
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['expandable', 'selected', 'disabled'],
    });
  }

  /** Disconnects the mutation observer and removes the row-change listener. */
  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer.disconnect();
    this.removeEventListener('change', this.#onRowChange);
  }

  /** Re-propagates `selectionMode` to body rows and keeps `aria-label` in sync when `caption` or `selectionMode` changes. */
  override updated(changed: PropertyValueMap<this>) {
    if (changed.has('selectionMode')) {
      this.#propagateSelectionMode();
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
    const showControl = this.selectionMode !== 'none' || this.hasExpandableRows;
    for (const row of this.#getBodyRows()) row.showControl = showControl;
  }

  /** Returns all `mh-table-row` descendant elements as an array. */
  #getBodyRows(): TableRow[] {
    return Array.from(this.querySelectorAll<TableRow>('mh-table-row'));
  }

  /** Copies the table's `selectionMode` and shared radio group name down to every body row. */
  #propagateSelectionMode() {
    for (const row of this.#getBodyRows()) {
      row.selectionMode = this.selectionMode;
      row.selectionGroup = this.#selectionGroupName;
    }
  }

  /** Syncs the select-all checkbox to reflect whether all, some, or no enabled rows are currently selected. */
  #updateSelectAll() {
    if (this.selectionMode !== 'multi') return;
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
            ${
              this.selectionMode !== 'none' || this.hasExpandableRows
                ? html`<mh-table-header-cell part="select-all-cell">
                    ${
                      this.selectionMode === 'multi'
                        ? html`<mh-checkbox
                            part="select-all"
                            aria-label=${this.localize.term('selectAllRows')}
                            @change=${this.#onSelectAll}
                          ></mh-checkbox>`
                        : nothing
                    }
                  </mh-table-header-cell>`
                : nothing
            }
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
