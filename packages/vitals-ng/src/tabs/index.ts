import '@smals-belgium-shared/vitals/tabs';

import { Tab } from './tab';
import { TabGroup } from './tab-group';
import { TabLink } from './tab-link';

export * from './tab';
export * from './tab-group';
export * from './tab-link';

export const TABS = [TabGroup, Tab, TabLink];
