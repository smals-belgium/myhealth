import type { SlideToggle } from './slide-toggle';

export * from './slide-toggle';

declare global {
  interface HTMLElementTagNameMap {
    'mh-slide-toggle': SlideToggle;
  }
}
