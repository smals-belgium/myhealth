import { propUpdatedEffect } from '../core/controller';
import { getAllOptions } from '../form-control/option';

import { Iterator } from './iterator';

/**
 * Propagate disabled state to the buttons and options.
 */
export const disabledController = (host: Iterator) =>
  propUpdatedEffect(host, 'disabled', () =>
    getAllOptions(host).forEach(
      option => (option.disabled = host.disabled || !host.interactiveSelection),
    ),
  );
