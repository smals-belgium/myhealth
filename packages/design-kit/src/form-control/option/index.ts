import type { Option } from './option';

export * from './option.actions';
export * from './option.selectors';
export * from './option';
export * from './selected-option.controller';

declare global {
  interface HTMLElementTagNameMap {
    'mh-option': Option;
  }
}
