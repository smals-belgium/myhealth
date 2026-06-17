import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import styles from './dialog.css?inline';

import { DialogAfterClosedEvent, DialogAfterOpenedEvent } from './dialog.event';

/**
 * @summary Dialogs are modal popups that focus the user's attention on a single task or piece of information. They trap
 *  focus, dim the page behind a backdrop, and must be dismissed before the user can interact with the rest of the page.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/dialog
 * @status stable
 * @since 1.0
 *
 * @event mh-after-opened - Emitted after the dialog has opened.
 * @event mh-after-closed - Emitted after the dialog has closed. The `result` property carries the optional close value.
 *
 * @slot header - The dialog's header, typically a title.
 * @slot content - The dialog's main content.
 * @slot actions - The dialog's actions, typically buttons. Add the `dialog-close` attribute to any element here to
 *  close the dialog when it is activated; its value is forwarded as the close result.
 *
 * @csspart dialog - The native `dialog` element.
 * @csspart header - The container that wraps the `header` slot.
 * @csspart content - The container that wraps the `content` slot.
 * @csspart actions - The container that wraps the `actions` slot.
 *
 * @cssproperty [--spacing=var(--mh-space-m)] - The amount of space around and between sections of the dialog.
 * @cssproperty [--backdrop=color-mix(in srgb, var(--mh-color-brand-fill) 60%, transparent)] - The backdrop color.
 */
@customElement('mh-dialog')
export class Dialog extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  private static scrollLockOwners = new Set<Dialog>();
  private static bodyOverflowBeforeLock: string | null = null;
  private static documentOverflowBeforeLock: string | null = null;

  @query('[part="dialog"]') private readonly dialog!: HTMLDialogElement;

  /** An accessible name for the dialog, exposed to assistive technology. */
  @property() label?: string;

  /** Whether closing the dialog via the backdrop or the Escape key is disabled. */
  @property({ type: Boolean, reflect: true, attribute: 'disable-close' })
  disableClose = false;

  #result: unknown = undefined;
  #ownsScrollLock = false;

  /** Whether the dialog is currently open. */
  get isOpen() {
    return this.dialog?.open ?? false;
  }

  /** Opens the dialog as a modal and emits `mh-after-opened`. */
  open() {
    if (this.dialog.open) return;

    this.dialog.showModal();
    this.toggleAttribute('open', true);
    this.#acquireScrollLock();
    this.dispatchEvent(new DialogAfterOpenedEvent());
  }

  /** Closes the dialog, forwarding the optional `result` through `mh-after-closed`. */
  close(result?: unknown) {
    if (!this.dialog.open) return;

    this.#result = result;
    this.dialog.close();
  }

  #onClose = () => {
    this.#releaseScrollLock();
    this.toggleAttribute('open', false);
    this.dispatchEvent(new DialogAfterClosedEvent(this.#result));
    this.#result = undefined;
  };

  override disconnectedCallback() {
    this.#releaseScrollLock();
    super.disconnectedCallback();
  }

  #acquireScrollLock() {
    if (this.#ownsScrollLock) return;

    this.#ownsScrollLock = true;
    Dialog.scrollLockOwners.add(this);

    if (Dialog.scrollLockOwners.size > 1) return;

    Dialog.bodyOverflowBeforeLock = document.body.style.overflow;
    Dialog.documentOverflowBeforeLock = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  #releaseScrollLock() {
    if (!this.#ownsScrollLock) return;

    this.#ownsScrollLock = false;
    Dialog.scrollLockOwners.delete(this);

    if (Dialog.scrollLockOwners.size > 0) return;

    document.body.style.overflow = Dialog.bodyOverflowBeforeLock ?? '';
    document.documentElement.style.overflow =
      Dialog.documentOverflowBeforeLock ?? '';
    Dialog.bodyOverflowBeforeLock = null;
    Dialog.documentOverflowBeforeLock = null;
  }

  #onCancel = (event: Event) => {
    // The native `cancel` event fires for the Escape key. Block it when closing is disabled.
    if (this.disableClose) event.preventDefault();
  };

  #onClick = (event: MouseEvent) => {
    // Close when an element flagged with `dialog-close` is activated, forwarding its value as the result.
    const trigger = event
      .composedPath()
      .find(
        (target): target is HTMLElement =>
          target instanceof HTMLElement && target.hasAttribute('dialog-close'),
      );

    if (trigger) {
      this.close(trigger.getAttribute('dialog-close') || undefined);
      return;
    }

    // Light dismiss: a click on the backdrop registers on the dialog element itself.
    if (!this.disableClose && event.target === this.dialog) this.close();
  };

  override render() {
    return html`
      <dialog
        part="dialog"
        aria-label=${ifDefined(this.label)}
        @close=${this.#onClose}
        @cancel=${this.#onCancel}
        @click=${this.#onClick}
      >
        <header part="header">
          <slot name="header"></slot>
        </header>

        <div part="content">
          <slot name="content"></slot>
        </div>

        <footer part="actions">
          <slot name="actions"></slot>
        </footer>
      </dialog>
    `;
  }
}
