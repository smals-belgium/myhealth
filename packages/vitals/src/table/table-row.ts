import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { LocalizeController } from '../core/i18n';
import type { Radio } from '../radio';

import { RowExpandChangeEvent } from './row-expand-change.event';
import type { SelectionMode } from './selection-mode';
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
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/table
 * @status stable
 * @since 1.0
 *
 * @slot - Regular cell content (`mh-table-cell` elements).
 * @slot expansion - Content shown in the expanded region below the main row. When
 *   this slot has content, the row automatically becomes expandable and shows a
 *   chevron button to expand/collapse it.
 *
 * @event {Event} change - Emitted when the row selection state changes.
 * @event {RowExpandChangeEvent} mh-table-row-expand-change - Emitted when the row is expanded or collapsed.
 *
 * @csspart row - The main row container (`display: table-row`).
 * @csspart control-cell - The leading cell containing the checkbox/radio and/or expand button.
 * @csspart checkbox - The selection checkbox (`mh-checkbox`), shown in `multi` selection mode.
 * @csspart radio - The selection radio button (`mh-radio`), shown in `single` selection mode.
 * @csspart expand-button - The expansion toggle button.
 * @csspart expansion-row - The secondary row shown when the row is expanded.
 * @csspart expansion-cell - The cell inside the expansion row.
 *
 * @dependency mh-checkbox
 * @dependency mh-icon-button
 * @dependency mh-radio
 */
@customElement('mh-table-row')
export class TableRow extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  private readonly localize = new LocalizeController(this);

  readonly #expansionId = nextExpansionId();

  #observer!: MutationObserver;

  /** Number of data cells, used to size the expansion cell for assistive tech. */
  @state() private columnCount = 1;

  /** Whether this row currently has content in the `expansion` slot. Reflected as the `expandable` attribute. */
  @state() private hasExpansion = false;

  /** Whether this row can be expanded, computed automatically from the presence of content in the `expansion` slot. */
  get expandable(): boolean {
    return this.hasExpansion;
  }

  /** Identifier used in `SelectionChangeEvent` emitted by the parent `mh-table`. */
  @property({ reflect: true }) value = '';

  /** Whether the row expansion region is visible. */
  @property({ type: Boolean, reflect: true }) expanded = false;

  /** Set by the parent `mh-table` to control this row's selection UI ('none' | 'single' | 'multi'). */
  @property({ reflect: true, attribute: 'selection-mode' })
  selectionMode: SelectionMode = 'none';

  /**
   * Set by the parent `mh-table` to a shared, table-scoped `name` so this
   * row's radio button (in `single` selection mode) is mutually exclusive
   * with sibling rows.
   */
  @property({ attribute: false }) selectionGroup = '';

  /** Whether this row's checkbox or radio button is checked. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** When set, the checkbox/radio is shown but not interactive. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Set by the parent `mh-table` to ensure a control cell is always rendered
   * for column alignment, even when this row is neither selectable nor expandable.
   */
  @property({ type: Boolean, reflect: true, attribute: 'show-control' })
  showControl = false;

  /** Detects initial expansion content and starts observing for content added or removed afterwards. */
  override connectedCallback() {
    super.connectedCallback();
    this.#updateHasExpansion();
    this.#observer = new MutationObserver(() => this.#updateHasExpansion());
    this.#observer.observe(this, { childList: true });
  }

  /** Stops observing the light DOM for expansion content changes. */
  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer.disconnect();
  }

  /**
   * Checks whether any direct child is slotted into the `expansion` region
   * and reflects the result as the `expandable` attribute (for CSS and for
   * the parent `mh-table` to detect via `querySelector`).
   */
  #updateHasExpansion() {
    this.hasExpansion = Array.from(this.children).some(
      el => el.getAttribute('slot') === 'expansion',
    );
    this.toggleAttribute('expandable', this.hasExpansion);
  }

  /** Handles the checkbox `change` event; toggles `selected` and re-emits a `change` event on the row. */
  #onCheckboxChange(event: Event) {
    event.stopPropagation();
    this.selected = !this.selected;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /**
   * Handles the radio button `change` event. Reads the radio's actual
   * `checked` state (rather than toggling blindly) because this handler
   * also fires for sibling rows whose radio gets unchecked as a side effect
   * of this row's radio becoming checked (native single-select exclusivity
   * via the shared `name`/radio group).
   */
  #onRadioChange(event: Event) {
    event.stopPropagation();
    const radio = event.target as Radio;
    if (this.selected === radio.checked) return;
    this.selected = radio.checked;
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
   * - `multi` selection mode: toggles row selection.
   * - `single` selection mode: selects this row (clicking an already-selected row is a no-op, matching native radio behavior).
   * - `none`, but expandable: toggles row expansion.
   * - Neither: no-op.
   * Clicks originating inside the control-cell are ignored so they don't
   * double-trigger alongside the checkbox/radio/expand-button own handlers.
   */
  #onRowClick(event: Event) {
    const inControlCell = event
      .composedPath()
      .some(
        el =>
          el instanceof Element && el.getAttribute('part') === 'control-cell',
      );
    if (inControlCell) return;
    if (this.selectionMode === 'multi') {
      if (this.disabled) return;
      this.selected = !this.selected;
      this.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (this.selectionMode === 'single') {
      if (this.disabled || this.selected) return;
      this.selected = true;
      this.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (this.hasExpansion) this.#onExpandClick();
  }

  /** Renders the leading control cell containing the selection checkbox/radio and/or the expand/collapse button. */
  #renderControlCell() {
    return html`<div
      part="control-cell"
      role="cell"
    >
      ${
        this.selectionMode === 'multi'
          ? html`<mh-checkbox
              part="checkbox"
              .checked=${this.selected}
              .disabled=${this.disabled}
              aria-label=${this.localize.term('selectRow')}
              @change=${this.#onCheckboxChange}
            ></mh-checkbox>`
          : nothing
      }
      ${
        this.selectionMode === 'single'
          ? html`<mh-radio
              part="radio"
              name=${this.selectionGroup}
              value=${this.value}
              .checked=${this.selected}
              .disabled=${this.disabled}
              aria-label=${this.localize.term('selectRow')}
              @change=${this.#onRadioChange}
            ></mh-radio>`
          : nothing
      }
      ${
        this.hasExpansion
          ? html`<mh-icon-button
              part="expand-button"
              name="keyboard_arrow_down"
              aria-expanded=${this.expanded ? 'true' : 'false'}
              aria-controls=${this.#expansionId}
              label=${
                this.expanded
                  ? this.localize.term('collapseRow')
                  : this.localize.term('expandRow')
              }
              @click=${this.#onExpandClick}
            ></mh-icon-button>`
          : nothing
      }
    </div>`;
  }

  override render() {
    const hasControl =
      this.showControl || this.selectionMode !== 'none' || this.hasExpansion;
    return html`
      <div
        part="row"
        role="row"
        @click=${this.#onRowClick}
      >
        ${hasControl ? this.#renderControlCell() : nothing}
        <slot @slotchange=${this.#onDefaultSlotChange}></slot>
      </div>
      <div
        part="expansion-row"
        role="row"
        id=${this.#expansionId}
        ?hidden=${!this.hasExpansion || !this.expanded}
      >
        <div
          part="expansion-cell"
          role="cell"
          aria-colspan=${this.columnCount + (hasControl ? 1 : 0)}
        >
          <slot name="expansion"></slot>
        </div>
      </div>
    `;
  }
}
