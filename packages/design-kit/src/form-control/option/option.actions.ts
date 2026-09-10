import { cssStates } from '../../core/css';

import { getActiveOption, getAllOptions, OptionHost } from './option.selectors';

const eventOptions = { bubbles: true, composed: true };

/**
 * Updates the host component's value with the value of the currently active Option,
 * and fires corresponding native events to signal the change.
 *
 * (Setting the `value` from the outside should not trigger these events, only internal updates)
 */
export const commitActiveValue = (host: OptionHost) => {
  // Not sure how I feel about this one; to be evaluated
  if ('open' in host) host.open = false;
  host.value = getActiveOption(host)?.value;

  host.dispatchEvent(new InputEvent('input', eventOptions));
  host.dispatchEvent(new Event('change', eventOptions));
};

/**
 * Deactivate the currently active Option and activate the one at the given index.
 */
export const activateAt = (host: HTMLElement, indexToActivate: number) =>
  Array.from(getAllOptions(host))
    .map(cssStates)
    .forEach((state, index) => state.set('active', index === indexToActivate));
