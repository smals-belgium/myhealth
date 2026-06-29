import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { LocalizeController } from '../core/i18n';

import { CalloutAfterClosedEvent } from './callout-after-closed.event';
import { CalloutAfterOpenedEvent } from './callout-after-opened.event';
import { CalloutExpandedChangedEvent } from './callout-expanded-changed.event';
import appearance from './callout.appearance.css?inline';
import styles from './callout.css?inline';

export type CalloutVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'notification';
export type CalloutAppearance = 'color' | 'white';
export type CalloutMode = 'normal' | 'expansion';

/** Maps each variant to the icon that is displayed at the start of the callout. */
const VARIANT_ICONS: Record<CalloutVariant, string> = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'emergency_home',
  notification: 'notifications',
};

/**
 * @summary Callouts are inline banners that communicate a contextual status or message. They show a fixed icon for
 *  their variant, a title, an optional description, and optional actions. They can be dismissed, or expanded and
 *  collapsed.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/callout
 * @status stable
 * @since 1.0
 *
 * @dependency mh-icon
 * @dependency mh-icon-button
 *
 * @event mh-callout-after-opened - Emitted after the callout has opened.
 * @event mh-callout-after-closed - Emitted after the callout has closed. The `result` property carries the optional close value.
 * @event mh-callout-expanded-changed - Emitted when an `expansion` callout is expanded or collapsed. The `expanded` property carries the new state.
 *
 * @slot title - The callout's title, shown next to the icon. In `expansion` mode, activating it toggles the callout.
 * @slot description - The callout's descriptive content, shown below the title.
 * @slot actions - The callout's actions, typically buttons. Add the `callout-close` attribute to any element here to
 *  close the callout when it is activated; its value is forwarded as the close result.
 *
 * @csspart icon - The variant icon at the start of the callout.
 * @csspart header - The top row that wraps the icon, title, and trailing control. A toggle button in `expansion` mode.
 * @csspart title - The container for the `title` slot.
 * @csspart toggle - The chevron icon shown in `expansion` mode.
 * @csspart close - The close (`X`) icon button shown in `normal` mode.
 * @csspart region - The collapsible region that wraps the description and actions.
 * @csspart content - The inner wrapper that holds the description and actions, animated when collapsing.
 * @csspart description - The container for the `description` slot.
 * @csspart actions - The container that wraps the `actions` slot.
 *
 * @cssproperty [--mh-callout__spacing=var(--mh-space-m)] - The amount of space around and between sections of the callout.
 */
@customElement('mh-callout')
export class Callout extends LitElement {
  static override readonly styles = [styles, appearance].map(unsafeCSS);

  private readonly localize = new LocalizeController(this);

  /** The callout's variant. Determines the icon and color. */
  @property({ reflect: true }) variant: CalloutVariant = 'info';

  /** The callout's visual appearance. `color` tints the whole surface; `white` keeps a white surface with a colored icon. */
  @property({ reflect: true }) appearance: CalloutAppearance = 'color';

  /** The callout's mode. `expansion` replaces the close button with a chevron and lets the callout collapse. */
  @property({ reflect: true }) mode: CalloutMode = 'normal';

  /** Whether an `expansion` callout is expanded. Has no effect in `normal` mode. */
  @property({ type: Boolean, reflect: true }) expanded = false;

  #result?: string | boolean;

  /** Whether the callout is currently open. */
  get isOpen() {
    return this.hasAttribute('open');
  }

  /** Opens the callout and emits `mh-callout-after-opened`. */
  open() {
    if (this.isOpen) return;

    this.toggleAttribute('open', true);
    this.dispatchEvent(new CalloutAfterOpenedEvent());
  }

  /** Closes the callout, forwarding the optional `result` through `mh-callout-after-closed`. */
  close(result?: string | boolean) {
    if (!this.isOpen) return;

    this.#result = result;
    this.toggleAttribute('open', false);
    this.dispatchEvent(new CalloutAfterClosedEvent(this.#result));
    this.#resetResult();
  }

  /** Resets the pending close result back to its empty default. */
  #resetResult(result?: string | boolean) {
    this.#result = result;
  }

  #toggle = () => {
    this.expanded = !this.expanded;
    this.dispatchEvent(new CalloutExpandedChangedEvent(this.expanded));
  };

  #onCloseClick = () => this.close();

  #onClick = (event: MouseEvent) => {
    // Close when an element flagged with `callout-close` is activated, forwarding its value as the result.
    const trigger = event
      .composedPath()
      .find(
        (target): target is HTMLElement =>
          target instanceof HTMLElement && target.hasAttribute('callout-close'),
      );

    if (!trigger) return;

    const result = trigger.getAttribute('callout-close');
    if (result) this.close(result);
    else this.close();
  };

  override render() {
    const collapsed = this.mode === 'expansion' && !this.expanded;

    return html`
      ${this.#renderHeader()}

      <div
        part="region"
        aria-labelledby="title"
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
