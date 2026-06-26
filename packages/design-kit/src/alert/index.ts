import type { Alert } from './alert';

export * from './alert';
export * from './alert-after-closed.event';
export * from './alert-after-opened.event';
export * from './alert-expanded-changed.event';

declare global {
  interface HTMLElementTagNameMap {
    'mh-alert': Alert;
  }
}
