import { cssStateReflect } from '../core/css';
import { formValueController } from '../form-control';
import { selectedOptionController } from '../form-control/option';

import { keyboardController } from './keyboard.controller';
import { placeholderController } from './placeholder.controller';
import { popoverController } from './popover.controller';
import type { Select } from './select';

export const selectControllers = (host: Select) =>
  [
    () => cssStateReflect(host, ['disabled', 'open', 'required']),
    keyboardController,
    formValueController,
    placeholderController,
    popoverController,
    selectedOptionController,
  ].map(ctrl => host.addController(ctrl(host)));
