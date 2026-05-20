import type { Icon } from './icon';

export * from './icon';

declare global {
  interface HTMLElementTagNameMap {
    'mh-icon': Icon;
  }
}
