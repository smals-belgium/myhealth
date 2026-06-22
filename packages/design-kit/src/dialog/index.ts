import type { Dialog } from './dialog';

export * from './dialog';
export * from './dialog-after-closed.event';
export * from './dialog-after-opened.event';

declare global {
  interface HTMLElementTagNameMap {
    'mh-dialog': Dialog;
  }
}
