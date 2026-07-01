import type { Callout } from './callout';
import type { ExpandableCallout } from './expandable-callout';

export * from './callout';
export * from './expandable-callout';
export type { CalloutAppearance, CalloutVariant } from './base';
export * from './callout-after-closed.event';
export * from './callout-after-opened.event';
export * from './callout-expanded-changed.event';

declare global {
  interface HTMLElementTagNameMap {
    'mh-callout': Callout;
    'mh-expandable-callout': ExpandableCallout;
  }
}
