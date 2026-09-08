import { LitElement } from 'lit';

import { getInternals } from '../internals';

export const getInternalsMock = (el: LitElement) => {
  const internals = getInternals(el);

  return {
    get role() {
      return internals.role;
    },
    setFormValue: vi.spyOn(internals, 'setFormValue'),
  };
};
