import type { Spinner } from './spinner';

export * from './spinner';

declare global {
  interface HTMLElementTagNameMap {
    'mh-spinner': Spinner;
  }
}
