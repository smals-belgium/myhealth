import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { LocalizeController } from '../core/i18n';
import { liveAnnouncer } from '../core/live-announcer';

import { SnackbarDismissedEvent } from './snackbar-dismissed.event';
import type { SnackbarDismissReason } from './snackbar-dismissed.event';
import styles from './snackbar.css?inline';

/** Configuration for a snackbar opened via {@link Snackbar.open}. */
export interface SnackbarConfig {
  /** Auto-dismiss the snackbar after this many milliseconds. Defaults to `3000`. Set to `0` to keep it open until dismissed. */
  duration?: number;
  /** The `aria-live` politeness used to announce the message. Defaults to `polite`. */
  politeness?: 'polite' | 'assertive';
}

/** The default auto-dismiss duration, in milliseconds. */
export const DEFAULT_SNACKBAR_DURATION = 3000;

/**
 * @summary Snackbars are brief, transient messages about an app process, shown at the bottom of the screen. They do not
 *  interrupt the user and only one is visible at a time.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/snackbar
 * @status stable
 * @since 1.0
 *
 * @dependency mh-icon-button
 *
 * @event mh-snackbar-dismissed - Emitted after the snackbar has been dismissed. The `reason` property describes why.
 *
 * @slot - The snackbar's message content. Falls back to the `message` argument passed to `open()`.
 *
 * @csspart snackbar - The snackbar's container surface.
 * @csspart message - The element wrapping the message.
 * @csspart close - The close (`X`) icon button.
 *
 * @cssproperty [--mh-snackbar__spacing=var(--mh-space-m)] - The amount of space around and between sections of the snackbar.
 * @cssproperty [--mh-snackbar__background=var(--mh-color-neutral-fill-louder)] - The background color of the surface.
 * @cssproperty [--mh-snackbar__color=var(--mh-color-neutral-type-quieter)] - The text and icon color.
 * @cssproperty [--mh-snackbar__width=360px] - The width of the surface including its margins. Scales down to the viewport width on smaller screens.
 * @cssproperty [--mh-snackbar__inset=var(--mh-space-m)] - The margin around the surface.
 */
@customElement('mh-snackbar')
export class Snackbar extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  /** The snackbar that is currently open, if any. Only one snackbar is shown at a time. */
  private static current?: Snackbar;

  private readonly localize = new LocalizeController(this);

  /** The message to display. Set automatically by {@link open}; a default slot takes precedence when provided. */
  @property() message = '';

  /** The `aria-live` politeness used to announce the message. */
  @property({ reflect: true }) politeness: 'polite' | 'assertive' = 'polite';

  #timer?: ReturnType<typeof setTimeout>;
  #duration = DEFAULT_SNACKBAR_DURATION;

  /** Whether the snackbar is currently open. */
  get isOpen() {
    return this.hasAttribute('open');
  }

  /**
   * Opens the snackbar with the given message. Any snackbar that is already open is dismissed first, so that only one
   * snackbar is visible at a time.
   */
  open(message: string, config: SnackbarConfig = {}) {
    Snackbar.current?.dismiss();

    this.message = message;
    this.politeness = config.politeness ?? 'polite';
    this.#duration = config.duration ?? DEFAULT_SNACKBAR_DURATION;
    this.toggleAttribute('open', true);
    Snackbar.current = this;

    liveAnnouncer.announce(message, this.politeness);
    this.#startTimer();
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
    if (this.#duration > 0)
      this.#timer = setTimeout(() => this.dismiss('timeout'), this.#duration);
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

  #onCloseClick = () => this.dismiss('close-button');

  // Pause the auto-dismiss timer while the pointer rests on the snackbar or it holds focus, then restart it on leave.
  // Pausing on focus keeps the snackbar from disappearing while a keyboard or screen-reader user interacts with it.
  #pause = () => this.#clearTimer();
  #resume = () => {
    if (this.isOpen) this.#startTimer();
  };

  override render() {
    return html`
      <div
        part="snackbar"
        @pointerenter=${this.#pause}
        @pointerleave=${this.#resume}
        @focusin=${this.#pause}
        @focusout=${this.#resume}
      >
        <span
          part="message"
          aria-hidden="true"
        >
          <slot>${this.message}</slot>
        </span>
        <mh-icon-button
          part="close"
          name="close"
          loudness="loud"
          label=${this.localize.term('close')}
          @click=${this.#onCloseClick}
        ></mh-icon-button>
      </div>
    `;
  }
}
