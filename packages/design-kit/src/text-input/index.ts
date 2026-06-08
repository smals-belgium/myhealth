import type { TextInput } from './text-input';

export * from './text-input';

declare global {
  interface HTMLElementTagNameMap {
    'mh-text-input': TextInput;
  }
}
