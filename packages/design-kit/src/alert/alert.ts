import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { LocalizeController } from '../core/i18n';
import { liveAnnouncer } from '../core/live-announcer';
import type { LiveAnnouncerPoliteness } from '../core/live-announcer';

import { AlertAfterClosedEvent } from './alert-after-closed.event';
import { AlertAfterOpenedEvent } from './alert-after-opened.event';
import { AlertExpandedChangedEvent } from './alert-expanded-changed.event';
import appearance from './alert.appearance.css?inline';
import styles from './alert.css?inline';

export type AlertVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'notification';
export type AlertAppearance = 'color' | 'white';
export type AlertMode = 'normal' | 'expansion';

/** Maps each variant to the icon that is displayed at the start of the alert. */
const VARIANT_ICONS: Record<AlertVariant, string> = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'emergency_home',
  notification: 'notifications',
};

/**
 * @summary Alerts are inline banners that communicate a contextual status or message. They show a fixed icon for their
 *  variant, a title, an optional description, and optional actions. They can be dismissed, or expanded and collapsed.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/alert
 * @status stable
 * @since 1.0
 *
 * @dependency mh-icon
 * @dependency mh-icon-button
 *
 * @event mh-alert-after-opened - Emitted after the alert has opened.
 * @event mh-alert-after-closed - Emitted after the alert has closed. The `result` property carries the optional close value.
 * @event mh-alert-expanded-changed - Emitted when an `expansion` alert is expanded or collapsed. The `expanded` property carries the new state.
 *
 * @slot title - The alert's title, shown next to the icon. In `expansion` mode, activating it toggles the alert.
 * @slot description - The alert's descriptive content, shown below the title.
 * @slot actions - The alert's actions, typically buttons. Add the `alert-close` attribute to any element here to close
 *  the alert when it is activated; its value is forwarded as the close result.
 *
 * @csspart icon - The variant icon at the start of the alert.
 * @csspart header - The top row that wraps the icon, title, and trailing control. A toggle button in `expansion` mode.
 * @csspart title - The container for the `title` slot.
 * @csspart toggle - The chevron icon shown in `expansion` mode.
 * @csspart close - The close (`X`) icon button shown in `normal` mode.
 * @csspart region - The collapsible region that wraps the description and actions.
 * @csspart content - The inner wrapper that holds the description and actions, animated when collapsing.
 * @csspart description - The container for the `description` slot.
 * @csspart actions - The container that wraps the `actions` slot.
 *
 * @cssproperty [--mh-alert__spacing=var(--mh-space-m)] - The amount of space around and between sections of the alert.
 */
@customElement('mh-alert')
export class Alert extends LitElement {
  static override readonly styles = [styles, appearance].map(unsafeCSS);

  private readonly localize = new LocalizeController(this);

  /** The alert's variant. Determines the icon and color. */
  @property({ reflect: true }) variant: AlertVariant = 'info';

  /** The alert's visual appearance. `color` tints the whole surface; `white` keeps a white surface with a colored icon. */
  @property({ reflect: true }) appearance: AlertAppearance = 'color';

  /** The alert's mode. `expansion` replaces the close button with a chevron and lets the alert collapse. */
  @property({ reflect: true }) mode: AlertMode = 'normal';

  /** Whether an `expansion` alert is expanded. Has no effect in `normal` mode. */
  @property({ type: Boolean, reflect: true }) expanded = false;

  /** The `aria-live` politeness used to announce the alert when it opens. */
  @property({ reflect: true }) politeness: LiveAnnouncerPoliteness = 'polite';

  #result?: string | boolean;

  /** Whether the alert is currently open. */
  get isOpen() {
    return this.hasAttribute('open');
  }

  /** Opens the alert, announces its content, and emits `mh-alert-after-opened`. */
  open() {
    if (this.isOpen) return;

    this.toggleAttribute('open', true);
    liveAnnouncer.announce(this.#announcement, this.politeness);
    this.dispatchEvent(new AlertAfterOpenedEvent());
  }

  /** Closes the alert, forwarding the optional `result` through `mh-alert-after-closed`. */
  close(result?: string | boolean) {
    if (!this.isOpen) return;

    this.#result = result;
    this.toggleAttribute('open', false);
    this.dispatchEvent(new AlertAfterClosedEvent(this.#result));
    this.#resetResult();
  }

  /** Resets the pending close result back to its empty default. */
  #resetResult(result?: string | boolean) {
    this.#result = result;
  }

  /** The text announced to assistive technology, built from the title and description content. */
  get #announcement() {
    const title = this.querySelector('[slot="title"]')?.textContent ?? '';
    const description =
      this.querySelector('[slot="description"]')?.textContent ?? '';
    return `${title} ${description}`.trim();
  }

  #toggle = () => {
    this.expanded = !this.expanded;
    this.dispatchEvent(new AlertExpandedChangedEvent(this.expanded));
  };

  #onCloseClick = () => this.close();

  #onClick = (event: MouseEvent) => {
    // Close when an element flagged with `alert-close` is activated, forwarding its value as the result.
    const trigger = event
      .composedPath()
      .find(
        (target): target is HTMLElement =>
          target instanceof HTMLElement && target.hasAttribute('alert-close'),
      );

    if (!trigger) return;

    const result = trigger.getAttribute('alert-close');
    if (result) this.close(result);
    else this.close();
  };

  override render() {
    const collapsed = this.mode === 'expansion' && !this.expanded;

    return html`
      ${this.#renderHeader()}

      <div
        part="region"
        id="region"
        ?inert=${collapsed}
        @click=${this.#onClick}
      >
        <div part="content">
          <slot
            name="description"
            part="description"
          ></slot>
          <div part="actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    `;
  }

  /** Renders the icon. */
  #renderIcon() {
    return html`
      <mh-icon
        part="icon"
        name=${VARIANT_ICONS[this.variant]}
        aria-hidden="true"
      ></mh-icon>
    `;
  }

  /**
   * Renders the header. In `expansion` mode the whole header is a single toggle button so every part of it is
   * clickable; otherwise it is a static row with a close button.
   */
  #renderHeader() {
    if (this.mode === 'expansion')
      return html`
        <button
          part="header"
          type="button"
          aria-expanded=${this.expanded}
          aria-controls="region"
          @click=${this.#toggle}
        >
          ${this.#renderIcon()}
          <span
            part="title"
            id="title"
          >
            <slot name="title"></slot>
          </span>
          <mh-icon
            part="toggle"
            name="keyboard_arrow_down"
            aria-hidden="true"
          ></mh-icon>
        </button>
      `;

    return html`
      <div part="header">
        ${this.#renderIcon()}
        <div
          part="title"
          id="title"
        >
          <slot name="title"></slot>
        </div>
        <mh-icon-button
          part="close"
          name="close"
          label=${this.localize.term('close')}
          @click=${this.#onCloseClick}
        ></mh-icon-button>
      </div>
    `;
  }
}
