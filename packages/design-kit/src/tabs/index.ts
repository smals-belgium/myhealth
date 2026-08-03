import type { Tab } from './tab';
import type { TabGroup } from './tab-group';
import type { TabLink } from './tab-link';

export * from './tab';
export * from './tab-group';
export * from './tab-link';
export * from './tab-link-navigate.event';
export * from './tab-selected-change.event';

declare global {
  interface HTMLElementTagNameMap {
    'mh-tab': Tab;
    'mh-tab-group': TabGroup;
    'mh-tab-link': TabLink;
  }
}
