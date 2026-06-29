import type { Callout } from './callout';

export * from './callout';
export * from './callout-after-closed.event';
export * from './callout-after-opened.event';
export * from './callout-expanded-changed.event';

declare global {
  interface HTMLElementTagNameMap {
    'mh-callout': Callout;
  }
}
