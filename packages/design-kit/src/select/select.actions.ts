import { cssStates } from '../core/css';

import { getActiveOption, getAllOptions } from './option.selectors';
import type { Select } from './select';

export const commitActiveValue = (host: Select) => {
  host.open = false;
  host.value = getActiveOption(host)?.value;

  host.dispatchEvent(
    new InputEvent('input', { bubbles: true, composed: true }),
  );
  host.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
};

export const activateAt = (host: Select, indexToActivate: number) =>
  Array.from(getAllOptions(host))
    .map(cssStates)
    .forEach((state, index) => state.set('active', index === indexToActivate));
