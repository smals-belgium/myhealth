import type { Snackbar } from './snackbar';

export * from './snackbar';
export * from './snackbar-dismissed.event';
export * from './snackbar-opened.event';

declare global {
  interface HTMLElementTagNameMap {
    'mh-snackbar': Snackbar;
  }
}
