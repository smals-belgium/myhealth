import type { Radio } from './radio';

export * from './radio';

declare global {
  interface HTMLElementTagNameMap {
    'mh-radio': Radio;
  }
}
