import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { LocalizeController } from '../core/i18n';

import { RowExpandChangeEvent } from './row-expand-change.event';
import styles from './table-row.css?inline';

let instanceId = 0;
/** Returns a unique, stable `id` value used to link the expand button (`aria-controls`) to the expansion region. */
const nextExpansionId = (): string => {
  const id = instanceId;
  instanceId += 1;
  return `mh-table-row-expansion-${String(id)}`;
};

/**
 * @summary A row in an `mh-table`. Supports optional row selection and inline expansion.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/table
 * @status stable
 * @since 1.0
 *
 * @slot - Regular cell content (`mh-table-cell` elements).
 * @slot expansion - Content shown in the expanded region below the main row.
 *
 * @event {Event} change - Emitted when the row selection state changes.
 * @event {RowExpandChangeEvent} mh-table-row-expand-change - Emitted when the row is expanded or collapsed.
 *
 * @csspart row - The main row container (`display: table-row`).
 * @csspart control-cell - The leading cell containing the checkbox and/or expand button.
 * @csspart checkbox - The selection checkbox (`mh-checkbox`).
 * @csspart expand-button - The expansion toggle button.
 * @csspart expansion-row - The secondary row shown when the row is expanded.
 * @csspart expansion-cell - The cell inside the expansion row.
 *
 * @dependency mh-checkbox
 * @dependency mh-icon-button
 */
@customElement('mh-table-row')
export class TableRow extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  private readonly localize = new LocalizeController(this);

  readonly #expansionId = nextExpansionId();

  /** Number of data cells, used to size the expansion cell for assistive tech. */
  @state() private columnCount = 1;

  /** Identifier used in `SelectionChangeEvent` emitted by the parent `mh-table`. */
  @property({ reflect: true }) value = '';

  /** When set, shows a chevron button to expand/collapse additional row content. */
  @property({ type: Boolean, reflect: true }) expandable = false;

  /** Whether the row expansion region is visible. */
  @property({ type: Boolean, reflect: true }) expanded = false;

  /** Set by the parent `mh-table` to show a selection checkbox on this row. */
  @property({ type: Boolean, reflect: true }) selectable = false;

  /** Whether this row's checkbox is checked. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** When set, the checkbox is shown but not interactive. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Set by the parent `mh-table` to ensure a control cell is always rendered
   * for column alignment, even when this row is neither selectable nor expandable.
   */
  @property({ type: Boolean, reflect: true, attribute: 'show-control' })
  showControl = false;

  /** Handles the checkbox `change` event; toggles `selected` and re-emits a `change` event on the row. */
  #onCheckboxChange(event: Event) {
    event.stopPropagation();
    this.selected = !this.selected;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /** Toggles the row's `expanded` state and emits `RowExpandChangeEvent`. */
  #onExpandClick() {
    this.expanded = !this.expanded;
    this.dispatchEvent(new RowExpandChangeEvent(this.expanded));
  }

  /** Counts slotted `mh-table-cell` elements so the expansion cell's `aria-colspan` can span all data columns. */
  #onDefaultSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.columnCount = Math.max(
      1,
      slot
        .assignedElements()
        .filter(el => el.tagName.toLowerCase() === 'mh-table-cell').length,
    );
  }

  /**
   * Handles row-body clicks:
   * - Selectable (with or without expandable): toggles row selection.
   * - Expandable only: toggles row expansion.
   * - Neither: no-op.
   * Clicks originating inside the control-cell are ignored so they don't
   * double-trigger alongside the checkbox/expand-button own handlers.
   */
  #onRowClick(event: Event) {
    const inControlCell = event
      .composedPath()
      .some(
        el =>
          el instanceof Element && el.getAttribute('part') === 'control-cell',
      );
    if (inControlCell) return;
    if (this.selectable) {
      if (this.disabled) return;
      this.selected = !this.selected;
      this.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (this.expandable) this.#onExpandClick();
  }

  /** Renders the leading control cell containing the selection checkbox and/or the expand/collapse button. */
  #renderControlCell() {
    return html`<div
      part="control-cell"
      role="cell"
    >
      ${this.selectable
        ? html`<mh-checkbox
            part="checkbox"
            .checked=${this.selected}
            .disabled=${this.disabled}
            aria-label=${this.localize.term('selectRow')}
            @change=${this.#onCheckboxChange}
          ></mh-checkbox>`
        : nothing}
      ${this.expandable
        ? html`<mh-icon-button
            part="expand-button"
            name="keyboard_arrow_down"
            loudness="quiet"
            aria-expanded=${this.expanded ? 'true' : 'false'}
            aria-controls=${this.#expansionId}
            label=${this.expanded
              ? this.localize.term('collapseRow')
              : this.localize.term('expandRow')}
            @click=${this.#onExpandClick}
          ></mh-icon-button>`
        : nothing}
    </div>`;
  }

  override render() {
    const hasControl = this.showControl || this.selectable || this.expandable;
    return html`
      <div
        part="row"
        role="row"
        @click=${this.#onRowClick}
      >
        ${hasControl ? this.#renderControlCell() : nothing}
        <slot @slotchange=${this.#onDefaultSlotChange}></slot>
      </div>
      ${this.expandable
        ? html`<div
            part="expansion-row"
            role="row"
            id=${this.#expansionId}
            ?hidden=${!this.expanded}
          >
            <div
              part="expansion-cell"
              role="cell"
              aria-colspan=${this.columnCount + (hasControl ? 1 : 0)}
            >
              <slot name="expansion"></slot>
            </div>
          </div>`
        : nothing}
    `;
  }
}
