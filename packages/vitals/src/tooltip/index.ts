import type { Tooltip } from './tooltip';

export * from './tooltip';
declare global {
  interface HTMLElementTagNameMap {
    'mh-tooltip': Tooltip;
  }
}
