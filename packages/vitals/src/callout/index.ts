import type { Callout } from './callout';
import type { ExpandableCallout } from './expandable-callout';

export * from './callout';
export * from './expandable-callout';
export type { CalloutAppearance, CalloutVariant } from './base';

declare global {
  interface HTMLElementTagNameMap {
    'mh-callout': Callout;
    'mh-expandable-callout': ExpandableCallout;
  }
}
