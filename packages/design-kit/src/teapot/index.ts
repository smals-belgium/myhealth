import type { Teapot } from './teapot';

export * from './teapot';

declare global {
  interface HTMLElementTagNameMap {
    'mh-teapot': Teapot;
  }
}
