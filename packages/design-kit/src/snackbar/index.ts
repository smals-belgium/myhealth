import type { Snackbar } from './snackbar';

export * from './snackbar';
export * from './snackbar-dismissed.event';

declare global {
  interface HTMLElementTagNameMap {
    'mh-snackbar': Snackbar;
  }
}
