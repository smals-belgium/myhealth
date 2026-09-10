import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';

import placement from './tooltip-placement.css?inline';
import styles from './tooltip.css?inline';

export type TooltipPlacement =
  'top' | 'bottom' | 'left' | 'right' | 'start' | 'end';

/** Default delay in ms before showing the tooltip. */
export const DEFAULT_TOOLTIP_SHOW_DELAY = 0;

/** Default delay in ms before hiding the tooltip. */
export const DEFAULT_TOOLTIP_HIDE_DELAY = 0;

/** Duration in ms of a long-press gesture before showing the tooltip on touch devices. */
const TOUCH_LONG_PRESS_DELAY = 500;

let tooltipCounter = 0;

/**
 * @summary Tooltips provide brief descriptive labels that appear when a trigger element gains
 *   hover or keyboard focus. They are non-interactive and dismissed by moving away or pressing Escape.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/tooltip
 * @status experimental
 * @since 1.0
 *
 * @slot - The trigger element (preferably a focusable element such as a button or link).
 * @slot content - Optional tooltip content. Takes precedence over the `content` property.
 *
 * @csspart trigger - Wrapper around the trigger slot.
 * @csspart tooltip - The visible tooltip surface.
 *
 * @cssproperty [--mh-tooltip__color-fill=var(--mh-color-neutral-fill-loud)] - Tooltip background color.
 * @cssproperty [--mh-tooltip__color-type=var(--mh-color-neutral-type-quieter)] - Tooltip text color.
 * @cssproperty [--mh-tooltip__size-border-radius=var(--mh-border-radius)] - Tooltip border radius.
 * @cssproperty [--mh-tooltip__size-padding-block=0.375rem] - Vertical padding.
 * @cssproperty [--mh-tooltip__size-padding-inline=0.5rem] - Horizontal padding.
 * @cssproperty [--mh-tooltip__size-offset=0.25rem] - Gap between the trigger and the tooltip surface.
 * @cssproperty [--mh-tooltip__z-index=1000] - Stacking order.
 */
@customElement('mh-tooltip')
export class Tooltip extends LitElement {
  static override readonly styles = [unsafeCSS(styles), unsafeCSS(placement)];

  /** Fallback text when no `content` slot content is provided. */
  @property() content = '';

  /** Position of the tooltip relative to the trigger. `start`/`end` adapt to text direction; `left`/`right` are always physical. */
  @property({ reflect: true }) placement: TooltipPlacement = 'top';

  /** Whether the tooltip is currently visible. Can be set programmatically. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Disables tooltip interaction; the tooltip will not open. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Delay in milliseconds before showing the tooltip. Override per call via `show(delay)`. */
  @property({ type: Number, attribute: 'show-delay' })
  showDelay: number = DEFAULT_TOOLTIP_SHOW_DELAY;

  /** Delay in milliseconds before hiding the tooltip. Override per call via `hide(delay)`. */
  @property({ type: Number, attribute: 'hide-delay' })
  hideDelay: number = DEFAULT_TOOLTIP_HIDE_DELAY;

  @queryAssignedElements({ slot: '' })
  private readonly defaultSlotElements!: HTMLElement[];

  @query('slot[name="content"]')
  private contentSlot?: HTMLSlotElement;

  private readonly tooltipId = `mh-tooltip-${(tooltipCounter += 1).toString()}`;
  private triggerElement?: HTMLElement;

  #showTimer?: ReturnType<typeof setTimeout>;
  #hideTimer?: ReturnType<typeof setTimeout>;
  #touchTimer?: ReturnType<typeof setTimeout>;

  /** Whether the tooltip is currently visible. Alias for `open`. */
  get isOpen() {
    return this.open;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('focusin', this.#onFocusIn);
    this.addEventListener('focusout', this.#onFocusOut);
    this.addEventListener('pointerenter', this.#onPointerEnter);
    this.addEventListener('pointerleave', this.#onPointerLeave);
    this.addEventListener('keydown', this.#onKeyDown);
    this.addEventListener('touchstart', this.#onTouchStart, { passive: true });
    this.addEventListener('touchend', this.#onTouchEnd);
    this.addEventListener('touchcancel', this.#onTouchEnd);
    this.addEventListener('touchmove', this.#onTouchEnd, { passive: true });
  }

  override disconnectedCallback() {
    this.#removeListeners();
    this.#clearTimers();
    this.#detachFromTrigger();
    super.disconnectedCallback();
  }

  protected override updated(changed: PropertyValues<this>) {
    super.updated(changed);

    if (changed.has('open'))
      this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #removeListeners() {
    this.removeEventListener('focusin', this.#onFocusIn);
    this.removeEventListener('focusout', this.#onFocusOut);
    this.removeEventListener('pointerenter', this.#onPointerEnter);
    this.removeEventListener('pointerleave', this.#onPointerLeave);
    this.removeEventListener('keydown', this.#onKeyDown);
    this.removeEventListener('touchstart', this.#onTouchStart);
    this.removeEventListener('touchend', this.#onTouchEnd);
    this.removeEventListener('touchcancel', this.#onTouchEnd);
    this.removeEventListener('touchmove', this.#onTouchEnd);
  }

  protected override willUpdate(changed: PropertyValues<this>) {
    // Close the tooltip when it becomes disabled, folded into the current
    // update so it does not schedule an extra render cycle.
    if (changed.has('disabled') && this.disabled && this.open)
      this.open = false;
  }

  /**
   * Shows the tooltip, optionally after a delay.
   * Cancels any pending hide timer.
   * @param delay - Override for `showDelay`. Pass `0` to show immediately.
   */
  show(delay = this.showDelay) {
    if (this.disabled) return;
    if (!this.#hasRenderableContent()) return;

    clearTimeout(this.#hideTimer);

    if (delay <= 0) {
      this.open = true;
      return;
    }

    clearTimeout(this.#showTimer);

    this.#showTimer = setTimeout(() => {
      this.open = true;
    }, delay);
  }

  /**
   * Hides the tooltip, optionally after a delay.
   * Cancels any pending show timer.
   * @param delay - Override for `hideDelay`. Pass `0` to hide immediately.
   */
  hide(delay = this.hideDelay) {
    clearTimeout(this.#showTimer);

    if (delay <= 0) {
      this.open = false;
      return;
    }
    clearTimeout(this.#hideTimer);
    this.#hideTimer = setTimeout(() => {
      this.open = false;
    }, delay);
  }

  /** Toggles the tooltip: shows it when hidden, hides it when visible. */
  toggle() {
    if (this.open) this.hide(0);
    else this.show(0);
  }

  #onFocusIn = () => this.show();

  #onFocusOut = () => this.hide();

  #onPointerEnter = () => this.show();

  #onPointerLeave = () => this.hide();

  #onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.open) {
      event.stopPropagation();
      this.hide(0);
    }
  };

  #onTouchStart = () => {
    clearTimeout(this.#touchTimer);
    this.#touchTimer = setTimeout(() => this.show(0), TOUCH_LONG_PRESS_DELAY);
  };

  #onTouchEnd = () => {
    clearTimeout(this.#touchTimer);

    if (this.open) this.hide(0);
  };

  #clearTimers() {
    clearTimeout(this.#showTimer);
    clearTimeout(this.#hideTimer);
    clearTimeout(this.#touchTimer);
  }

  #hasRenderableContent() {
    const slotted =
      this.contentSlot
        ?.assignedNodes({ flatten: true })
        .some(node => (node.textContent ?? '').trim().length > 0) ?? false;

    return slotted || this.content.trim().length > 0;
  }

  #syncTriggerElement() {
    const [next] = this.defaultSlotElements;

    if (next === this.triggerElement) return;

    this.#detachFromTrigger();
    this.triggerElement = next;
    this.#attachToTrigger();
  }

  #attachToTrigger() {
    if (!this.triggerElement) return;

    const describedBy =
      this.triggerElement
        .getAttribute('aria-describedby')
        ?.split(/\s+/u)
        .filter(Boolean) ?? [];

    if (!describedBy.includes(this.tooltipId)) {
      describedBy.push(this.tooltipId);
      this.triggerElement.setAttribute(
        'aria-describedby',
        describedBy.join(' '),
      );
    }
  }

  #detachFromTrigger() {
    if (!this.triggerElement) return;

    const describedBy =
      this.triggerElement
        .getAttribute('aria-describedby')
        ?.split(/\s+/u)
        .filter(Boolean) ?? [];

    const next = describedBy.filter(id => id !== this.tooltipId);

    if (next.length > 0)
      this.triggerElement.setAttribute('aria-describedby', next.join(' '));
    else this.triggerElement.removeAttribute('aria-describedby');
  }

  override firstUpdated() {
    this.#syncTriggerElement();
  }

  override render() {
    return html`
      <slot
        part="trigger"
        @slotchange=${this.#syncTriggerElement}
      ></slot>

      <div
        id=${this.tooltipId}
        part="tooltip"
        role="tooltip"
      >
        <slot name="content">${this.content}</slot>
      </div>
    `;
  }
}
