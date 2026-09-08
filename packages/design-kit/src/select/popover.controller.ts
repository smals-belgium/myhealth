import { propUpdatedEffect } from '../core/controller';

import { getActiveIndex } from './option.selectors';
import { Select } from './select';
import { activateAt } from './select.actions';

/**
 * When the select `open` state changes, ensure the popover follows suit.
 * When opened, activate the selected option or the first one (if none selected yet).
 * When closed, deactivate all options.
 */
export const popoverController = (host: Select) =>
  propUpdatedEffect(host, 'open', () => {
    host.listbox?.togglePopover(host.open);
    activateAt(host, host.open ? getActiveIndex(host) : -1);
  });
