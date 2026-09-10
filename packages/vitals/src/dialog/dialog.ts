import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { childEventDirective } from '../core/directive';

import { DialogAfterClosedEvent } from './dialog-after-closed.event';
import { DialogAfterOpenedEvent } from './dialog-after-opened.event';
import styles from './dialog.css?inline';

export type DialogVariant = 'basic' | 'fullscreen';

export const dialogCloseDirective = 'mh-dialog-close';

// To be removed when TypeScript is upgraded to a version that adds this type
declare global {
  interface HTMLDialogElement {
    closedby: 'any' | 'closerequest' | 'none';
  }
}

/**
 * @summary Dialogs are modal popups that focus the user's attention on a single task or piece of information. They trap
 *  focus, dim the page behind a backdrop, and must be dismissed before the user can interact with the rest of the page.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/dialog
 * @status stable
 * @since 1.0
 *
 * @event mh-after-opened - Emitted after the dialog has opened.
 * @event mh-after-closed - Emitted after the dialog has closed. The `result` property carries the optional close value.
 *
 * @slot - The dialog's main content.
 * @slot header-title - The dialog's title, displayed at the start of the header.
 * @slot header-actions - Actions displayed at the end of the header, such as a close button.
 * @slot actions - The dialog's actions, typically buttons. Add the `mh-dialog-close` attribute to any element here to
 *  close the dialog when it is activated; its value is forwarded as the close result.
 *
 * @csspart dialog - The native `dialog` element.
 * @csspart header - The container that wraps the header slots.
 * @csspart header-title - The `header-title` slot.
 * @csspart header-actions - The `header-actions` slot.
 * @csspart content - The default (content) slot.
 * @csspart actions - The container that wraps the `actions` slot.
 *
 * @cssproperty [--mh-dialog__size-space=var(--mh-space-m)] - The amount of space around and between sections of the dialog.
 * @cssproperty [--mh-dialog__color-backdrop=color-mix(in srgb, var(--mh-color-brand-fill) 60%, transparent)] - The backdrop color.
 * @cssproperty [--mh-dialog__box-shadow=var(--mh-shadow-l)] - The shadow cast by the dialog panel.
 */
@customElement('mh-dialog')
export class Dialog extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  private static scrollLockOwners = new Set<Dialog>();
  private static bodyOverflowBeforeLock: string | null = null;
  private static documentOverflowBeforeLock: string | null = null;

  @query('[part="dialog"]') private readonly dialog!: HTMLDialogElement;

  /** The dialog's variant. `fullscreen` makes the dialog cover the entire screen. */
  @property({ reflect: true }) variant: DialogVariant = 'basic';

  @property({ reflect: true }) closedby: HTMLDialogElement['closedby'] = 'any';

  #result?: string | boolean;
  #ownsScrollLock = false;

  /** Whether the dialog is currently open. */
  get open() {
    return this.dialog.open;
  }

  /** Opens the dialog as a modal and emits `mh-after-opened`. */
  showModal() {
    if (this.dialog.open) return;

    this.dialog.showModal();
    this.toggleAttribute('open', true);
    this.#acquireScrollLock();
    this.dispatchEvent(new DialogAfterOpenedEvent());
  }

  /**
   * Closes the dialog, forwarding the optional `result` through `mh-after-closed`.
   */
  close(result?: string | boolean) {
    if (!this.dialog.open) return;

    this.#result = result;
    this.dialog.close();
  }

  #onClose = () => {
    this.#releaseScrollLock();
    this.toggleAttribute('open', false);
    this.dispatchEvent(new Event('close'));
    this.dispatchEvent(new DialogAfterClosedEvent(this.#result));
    this.#resetResult();
  };

  /** Resets the pending close result back to its empty default. */
  #resetResult() {
    this.#result = undefined;
  }

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

  // Native `closedby` not supported by Safari yet, until then... custom implementation for escape key
  #onCancel = (event: Event) => {
    // There's a Chrome bug here which we'll leave for now: https://issues.chromium.org/issues/41491338
    if (this.closedby === 'none') event.preventDefault();
    else this.dispatchEvent(new Event('cancel'));
  };

  #onCloseTrigger = childEventDirective({
    name: dialogCloseDirective,
    onEvent: ({ value }) => (value ? this.close(value) : this.close()),
  });

  #onClick = (event: MouseEvent) => {
    this.#onCloseTrigger(event);

    // Native `closedby` not supported by Safari yet, until then... custom implementation for backdrop click
    if (this.closedby === 'any' && event.target === this.dialog) this.close();
  };

  override render() {
    return html`
      <dialog
        part="dialog"
        aria-labelledby="title"
        @close=${this.#onClose}
        @cancel=${this.#onCancel}
        @click=${this.#onClick}
      >
        <header
          part="header"
          role="presentation"
        >
          <slot
            name="header-title"
            part="header-title"
            id="title"
          ></slot>
          <slot
            name="header-actions"
            part="header-actions"
          ></slot>
        </header>

        <slot part="content"></slot>

        <footer
          part="actions"
          role="presentation"
        >
          <slot name="actions"></slot>
        </footer>
      </dialog>
    `;
  }
}
