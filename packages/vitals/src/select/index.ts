import type { Select } from './select';

export * from './select';

declare global {
  interface HTMLElementTagNameMap {
    'mh-select': Select;
  }
}
