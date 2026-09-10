import { ErrorEvent } from '../event';
import { getInternals } from '../internals/internals';
import type { VitalElement } from '../internals/internals';

export const cssStates = <K extends string>(host: VitalElement) => {
  const { states } = getInternals(host);

  return {
    set(name: K, active: boolean) {
      try {
        if (active) states.add(name);
        else states.delete(name);
      } catch (error) {
        if (String(error).includes("must start with '--'"))
          host.dispatchEvent(
            new ErrorEvent(
              'Your browser implements an outdated version of CustomStateSet. Consider using a polyfill',
            ),
          );
        else host.dispatchEvent(new ErrorEvent(error));
      }
    },

    has(name: K) {
      try {
        return states.has(name);
      } catch {
        return false;
      }
    },

    toString() {
      return [...states].join(', ');
    },
  };
};
