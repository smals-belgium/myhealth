import type { Anchor } from './anchor';
import type { Button } from './button';

export * from './anchor';
export * from './button';
export type { ButtonAppearance, ButtonSize, ButtonVariant } from './base';

declare global {
  interface HTMLElementTagNameMap {
    'mh-a': Anchor;
    'mh-button': Button;
  }
}
