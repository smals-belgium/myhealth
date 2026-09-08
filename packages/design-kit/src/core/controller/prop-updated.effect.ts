import { LitElement } from 'lit';

import { propChangeController } from './prop-change.controller';

export const propUpdatedEffect = <H extends LitElement>(
  host: H,
  key: keyof H,
  fn: () => void,
) => propChangeController(host, key, { updated: fn });
