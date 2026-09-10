import { unsafeCSS } from 'lit';

import size from '../form-control/form-control.size.css?inline';
import field from '../form-control/form-field.css?inline';

import iconButtonSlot from './text-input-icon-button.slot.css?inline';
import iconSlot from './text-input-icon.slot.css?inline';
import styles from './text-input.css?inline';
import vars from './text-input.vars.css?inline';

export const textInputStyles = [
  vars,
  field,
  styles,
  size,
  iconSlot,
  iconButtonSlot,
].map(unsafeCSS);
