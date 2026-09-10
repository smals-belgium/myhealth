import type { Skeleton } from './skeleton';

export * from './skeleton';

declare global {
  interface HTMLElementTagNameMap {
    'mh-skeleton': Skeleton;
  }
}
