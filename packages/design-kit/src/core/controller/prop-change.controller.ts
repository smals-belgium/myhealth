import { LitElement, ReactiveController } from 'lit';

export type PropController = {
  init?(): void;
  update?(): void;
  updated?(): void;
};

/**
 * Follows the lifecycle changes of a single property.
 * Because Lit controllers don't pass the property changes as parameter, we have to keep track of the value changes for
 * ourselves.
 */
export const propChangeController = <H extends LitElement>(
  host: H,
  key: keyof H,
  ctrl: PropController,
): ReactiveController => {
  let prevValue = host[key];
  let initialising = true;
  let updating = 0;

  return {
    hostConnected() {
      prevValue = host[key];
      if (ctrl.init) ctrl.init();
    },

    hostUpdate() {
      if (
        (initialising && host[key] !== undefined) ||
        prevValue !== host[key]
      ) {
        prevValue = host[key];
        updating += 1;
        if (ctrl.update) ctrl.update();
      }

      initialising = false;
    },

    hostUpdated() {
      if (updating) {
        updating -= 1;
        if (ctrl.updated) ctrl.updated();
      }
    },
  };
};
