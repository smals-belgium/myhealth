import { propUpdatedEffect } from '../core/controller';
import { cssStates } from '../core/css';

import { Select } from './select';

/**
 * Show placeholder only when the component has no selected value.
 */
export const placeholderController = (host: Select) => {
  const states = cssStates<'placeholder-shown'>(host);

  return propUpdatedEffect(host, 'value', () =>
    states.set('placeholder-shown', !host.value),
  );
};
