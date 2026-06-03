import type { Checkbox } from './checkbox';

export * from './checkbox';

declare global {
  interface HTMLElementTagNameMap {
    'mh-checkbox': Checkbox;
  }
}
