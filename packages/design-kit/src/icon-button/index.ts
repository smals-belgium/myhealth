import type { IconButton } from './icon-button';

export * from './icon-button';

declare global {
  interface HTMLElementTagNameMap {
    'mh-icon-button': IconButton;
  }
}
