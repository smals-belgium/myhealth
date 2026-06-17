import type { Dialog } from './dialog';

export * from './dialog';
export * from './dialog.event';

declare global {
  interface HTMLElementTagNameMap {
    'mh-dialog': Dialog;
  }
}
