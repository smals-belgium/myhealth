import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { LocalizeController } from '../core/i18n';
import { liveAnnouncer } from '../core/live-announcer';

import { SnackbarDismissedEvent } from './snackbar-dismissed.event';
import type { SnackbarDismissReason } from './snackbar-dismissed.event';
import { SnackbarOpenedEvent } from './snackbar-opened.event';
import styles from './snackbar.css?inline';

/** The default auto-dismiss duration, in milliseconds. */
export const DEFAULT_SNACKBAR_DURATION = 3000;

/**
 * @summary Snackbars are brief, transient messages about an app process, shown at the bottom of the screen. They do not
 *  interrupt the user and only one is visible at a time.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/snackbar
 * @status stable
 * @since 1.0
 *
 * @dependency mh-button
 * @dependency mh-icon-button
 *
 * @event mh-snackbar-opened - Emitted after the snackbar was opened.
 * @event mh-snackbar-dismissed - Emitted after the snackbar has been dismissed. The `reason` property describes why.
 *
 * @slot - The snackbar's message content. Falls back to the `message` argument passed to `open()`.
 *
 * @csspart snackbar - The snackbar's container surface.
 * @csspart message - The element wrapping the message.
 * @csspart action - The action button. A close (`X`) button by default, but can render a custom `action` label instead.
 *
 * @cssproperty [--mh-snackbar__size-space=var(--mh-space-m)] - The amount of space around and between sections of the snackbar.
 * @cssproperty [--mh-snackbar__color-fill=var(--mh-color-neutral-fill-louder)] - The background color of the surface.
 * @cssproperty [--mh-snackbar__color-type=var(--mh-color-neutral-type-quieter)] - The text and icon color.
 * @cssproperty [--mh-snackbar__size-width=360px] - The width of the surface including its margins. Scales down to the viewport width on smaller screens.
 * @cssproperty [--mh-snackbar__size-inset=var(--mh-space-m)] - The margin around the surface.
 */
@customElement('mh-snackbar')
export class Snackbar extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  /** The snackbar that is currently open, if any. Only one snackbar is shown at a time. */
  private static current?: Snackbar;

  private readonly localize = new LocalizeController(this);

  /** The `aria-live` politeness used to announce the message. */
  @property({ reflect: true }) politeness: 'polite' | 'assertive' = 'polite';

  /** Auto-dismiss the snackbar after this many milliseconds. Set to `0` to keep it open until dismissed. */
  @property({ type: Number }) duration = DEFAULT_SNACKBAR_DURATION;

  /** Label for an action button, shown in place of the default close (`X`) icon button. */
  @property() action?: string;

  #timer?: ReturnType<typeof setTimeout>;

  /** Whether the snackbar is currently open. */
  get isOpen() {
    return this.hasAttribute('open');
  }

  /**
   * Opens the snackbar with the given message. Any snackbar that is already open is dismissed first, so that only one
   * snackbar is visible at a time.
   */
  open() {
    Snackbar.current?.dismiss();

    this.toggleAttribute('open', true);
    Snackbar.current = this;

    const message = Array.from(this.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join('')
      .trim();

    liveAnnouncer.announce(message, this.politeness);
    this.#startTimer();

    this.dispatchEvent(new SnackbarOpenedEvent());
  }

  /** Dismisses the snackbar, emitting `mh-snackbar-dismissed` with the given reason. */
  dismiss(reason: SnackbarDismissReason = 'programmatic') {
    if (!this.isOpen) return;

    this.#clearTimer();
    this.toggleAttribute('open', false);
    this.#detach();

    this.dispatchEvent(new SnackbarDismissedEvent(reason));
  }

  override disconnectedCallback() {
    this.#clearTimer();
    this.#detach();
    super.disconnectedCallback();
  }

  /** (Re)starts the auto-dismiss timer for the configured duration. A duration of `0` keeps the snackbar open. */
  #startTimer() {
    this.#clearTimer();
    if (this.duration > 0)
      this.#timer = setTimeout(() => this.dismiss('timeout'), this.duration);
  }

  /** Stops the auto-dismiss timer, optionally replacing it with `next`. */
  #clearTimer(next?: ReturnType<typeof setTimeout>) {
    clearTimeout(this.#timer);
    this.#timer = next;
  }

  /** Releases this snackbar as the active one, optionally handing the slot to `next`. */
  #detach(next?: Snackbar) {
    if (Snackbar.current === this) Snackbar.current = next;
  }

  readonly #onActionClick = () => this.dismiss('action-button');

  // Pause the auto-dismiss timer while the pointer rests on the snackbar or it holds focus, then restart it on leave.
  // Pausing on focus keeps the snackbar from disappearing while a keyboard or screen-reader user interacts with it.
  readonly #pause = () => this.#clearTimer();
  readonly #resume = () => {
    if (this.isOpen) this.#startTimer();
  };

  readonly #renderActionButton = () => html`
    <mh-button
      part="action"
      size="s"
      variant="brand"
      @click=${this.#onActionClick}
    >
      ${this.action}
    </mh-button>
  `;

  readonly #renderCloseButton = () => html`
    <mh-icon-button
      part="action"
      name="close"
      loudness="loud"
      label=${this.localize.term('close')}
      @click=${this.#onActionClick}
    ></mh-icon-button>
  `;

  override render() {
    return html`
      <div
        part="snackbar"
        @pointerenter=${this.#pause}
        @pointerleave=${this.#resume}
        @focusin=${this.#pause}
        @focusout=${this.#resume}
      >
        <slot
          part="message"
          aria-hidden="true"
        >
        </slot>
        ${this.action ? this.#renderActionButton() : this.#renderCloseButton()}
      </div>
    `;
  }
}
