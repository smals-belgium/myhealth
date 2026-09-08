import { propUpdatedEffect } from '../core/controller';

import { TextInput } from './text-input';

/**
 * Propagate disabled state to all slotted elements that can be disabled.
 */
export const disabledController = (host: TextInput) =>
  propUpdatedEffect(host, 'disabled', () =>
    Array.from(host.slots ?? [])
      .flatMap(slot => slot.assignedElements({ flatten: true }))
      .filter(el => 'disabled' in el)
      .forEach(el => (el.disabled = host.disabled)),
  );
