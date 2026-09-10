import type { Card } from './card';

export * from './card';

declare global {
  interface HTMLElementTagNameMap {
    'mh-card': Card;
  }
}
