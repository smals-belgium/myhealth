import { propUpdateEffect } from '../../core/controller';

import { getOption, getSelectedOption, OptionHost } from './option.selectors';

/**
 * Remove selected state from the currently selected option
 * and set selected state on the option that matches the new value.
 * If the value is undefined, all options remain deselected.
 */
export const selectedOptionController = (host: OptionHost) =>
  propUpdateEffect(host, 'value', () => {
    getSelectedOption(host)?.removeAttribute('selected');

    if (host.value)
      getOption(host, `[value="${host.value}"]`)?.setAttribute('selected', '');
  });
