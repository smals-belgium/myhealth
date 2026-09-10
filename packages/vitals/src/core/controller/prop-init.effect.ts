import { LitElement } from 'lit';

import { propChangeController } from './prop-change.controller';

export const propInitEffect = <H extends LitElement>(
  host: H,
  key: keyof H,
  fn: () => void,
) => propChangeController(host, key, { init: fn });
