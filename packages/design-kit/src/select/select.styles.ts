import { unsafeCSS } from 'lit';

import size from '../form-control/form-control.size.css?inline';
import formField from '../form-control/form-field.css?inline';

import styles from './select.css?inline';

export const selectStyles = [formField, styles, size].map(unsafeCSS);
