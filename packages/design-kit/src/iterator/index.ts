import type { Iterator } from './iterator';

export * from './activate-selection.event';
export * from './iterator';

declare global {
  interface HTMLElementTagNameMap {
    'mh-iterator': Iterator;
  }
}
