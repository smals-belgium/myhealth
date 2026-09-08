import { cssStateReflect } from '../core/css';
import { formValueController } from '../form-control';

import { keyboardController } from './keyboard.controller';
import { placeholderController } from './placeholder.controller';
import { popoverController } from './popover.controller';
import type { Select } from './select';
import { selectedOptionController } from './selected-option.controller';

export const selectControllers = (host: Select) =>
  [
    () => cssStateReflect(host, ['disabled', 'open', 'required']),
    keyboardController,
    formValueController,
    placeholderController,
    popoverController,
    selectedOptionController,
  ].map(ctrl => host.addController(ctrl(host)));
