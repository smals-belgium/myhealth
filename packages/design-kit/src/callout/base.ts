import { html, LitElement, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';

import { CalloutAfterClosedEvent } from './callout-after-closed.event';
import { CalloutAfterOpenedEvent } from './callout-after-opened.event';
import appearance from './callout.appearance.css?inline';
import styles from './callout.css?inline';

export type CalloutVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'notification';
export type CalloutAppearance = 'color' | 'white';

/** Maps each variant to the icon that is displayed at the start of the callout. */
const VARIANT_ICONS: Record<CalloutVariant, string> = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'emergency_home',
  notification: 'notifications',
};

/** Shared behavior and styling for the regular and expandable callouts. */
export abstract class CalloutBase extends LitElement {
  static override readonly styles = [styles, appearance].map(unsafeCSS);

  /** The callout's variant. Determines the icon and color. */
  @property({ reflect: true }) variant: CalloutVariant = 'info';

  /** The callout's visual appearance. `color` tints the whole surface; `white` keeps a white surface with a colored icon. */
  @property({ reflect: true }) appearance: CalloutAppearance = 'color';

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

  /** Closes the callout when an element flagged with `callout-close` is activated, forwarding its value as the result. */
  protected onCloseTrigger = (event: MouseEvent) => {
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

  /** Renders the variant icon. */
  protected renderIcon() {
    return html`
      <mh-icon
        part="icon"
        name=${VARIANT_ICONS[this.variant]}
        aria-hidden="true"
      ></mh-icon>
    `;
  }
}
