import type { Chip } from './chip';

export * from './chip';
export * from './chip-remove.event';
export * from './chip-selection-change.event';

declare global {
  interface HTMLElementTagNameMap {
    'mh-chip': Chip;
  }
}
