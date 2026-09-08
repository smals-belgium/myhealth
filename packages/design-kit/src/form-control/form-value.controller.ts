import { LitElement } from 'lit';

import { propUpdatedEffect } from '../core/controller';
import { getInternals } from '../core/internals';

/**
 * When the component's value changes, sync it to the form value.
 */
export const formValueController = (
  host: LitElement & { value?: string | null },
) =>
  propUpdatedEffect(host, 'value', () =>
    getInternals(host).setFormValue(host.value ?? null),
  );
