import { ReactiveController } from 'lit';

import type { VitalElement } from '../internals';

import { cssStates } from './css-states';

export const cssStateReflect = <T extends VitalElement>(
  host: T,
  props: (keyof T & string)[],
): ReactiveController => {
  const states = cssStates(host);

  return {
    hostUpdate: () =>
      props.forEach(prop => states.set(prop, Boolean(host[prop]))),
  };
};
