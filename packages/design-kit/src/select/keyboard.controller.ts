/* eslint-disable no-param-reassign -- actually would make it less readable */
import { propUpdateEffect } from '../core/controller';

import {
  getActiveIndex,
  getAllOptions,
  getOptionAt,
  numOptions,
} from './option.selectors';
import type { Select } from './select';
import { activateAt, commitActiveValue } from './select.actions';

const pageSize = 5;

const hasModifier = (event: KeyboardEvent) =>
  event.metaKey || event.ctrlKey || event.altKey;

const navigationKeys = [
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
] as const;
type NavigationKey = (typeof navigationKeys)[number];
const isNavigationKeyEvent = (
  event: KeyboardEvent,
): event is KeyboardEvent & { key: NavigationKey } =>
  navigationKeys.includes(event.key as NavigationKey);

const activateOptionByChar = (host: Select, char: string) => {
  const index = Array.from(getAllOptions(host))
    .map(option => option.textContent.trim().toLowerCase())
    .findIndex(value => value.startsWith(char.toLowerCase()));

  if (index >= 0) {
    activateAt(host, index);
    getOptionAt(host, index).scrollIntoView(false);
  }
};

const proposeIndex = (host: Select, key: NavigationKey) => {
  const activeIndex = getActiveIndex(host);

  switch (key) {
    case 'ArrowDown':
      return activeIndex + 1;
    case 'ArrowUp':
      return activeIndex - 1;
    case 'PageDown':
      return Math.min(activeIndex + pageSize, numOptions(host) - 1);
    case 'PageUp':
      return Math.max(activeIndex - pageSize, 0);
    case 'Home':
      return 0;
    case 'End':
      return numOptions(host) - 1;
    default:
      return NaN;
  }
};

/**
 * Find the index of the next option that can be navigated to.
 * When at the start or end of the list, jump to the other side.
 * And skip over disabled options.
 */
const getNextEnabledIndex = (
  host: Select,
  index: number,
  direction: 1 | -1,
): number => {
  if (direction > 0 && index > numOptions(host) - 1) index = 0;
  if (direction < 0 && index < 0) index = numOptions(host) - 1;

  return getOptionAt(host, index).disabled
    ? getNextEnabledIndex(host, index + direction, direction)
    : index;
};

const navigate = (host: Select, key: NavigationKey) => {
  const direction = ['ArrowUp', 'PageUp', 'End'].includes(key) ? -1 : 1;
  const indexToActivate = getNextEnabledIndex(
    host,
    proposeIndex(host, key),
    direction,
  );

  activateAt(host, indexToActivate);
  if (indexToActivate >= 0)
    getOptionAt(host, indexToActivate).scrollIntoView(direction < 0);
};

/**
 * Listen for keyboard events only when the select is `open`.
 * Dismiss any events with modifiers or Escape key (popover needs to be able to capture that one to close).
 * - Enter: commit the currently active option as new selected value
 * - arrows, page keys, home and end: visually navigate through options by setting their active state
 * - any character key: visually navigate to first option who's label starts with that char
 */
export const keyboardController = (host: Select) => {
  const onKeyDown = (event: KeyboardEvent) => {
    if (hasModifier(event) || event.key === 'Escape') return;
    event.preventDefault();
    event.stopImmediatePropagation();

    if (event.key === 'Enter') commitActiveValue(host);
    if (isNavigationKeyEvent(event)) navigate(host, event.key);
    if (event.key.length === 1) activateOptionByChar(host, event.key);
  };

  return propUpdateEffect(host, 'open', () => {
    if (host.open) host.addEventListener('keydown', onKeyDown);
    else host.removeEventListener('keydown', onKeyDown);
  });
};
