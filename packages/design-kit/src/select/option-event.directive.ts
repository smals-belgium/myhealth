import { childEventDirective } from '../core/directive';

import type { Option } from './option';

export const onOptionEvent = (on: (option: Option) => void) =>
  childEventDirective({
    name: 'mh-option',
    onEvent: ({ target }) => on(target as Option),
  });
