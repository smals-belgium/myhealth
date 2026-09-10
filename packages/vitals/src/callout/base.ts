import { html, LitElement, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';

import { Variant } from '../core';
import variant from '../core/variant.css?inline';

import appearance from './callout.appearance.css?inline';
import styles from './callout.css?inline';
import variantOverrides from './callout.variant.css?inline';

export type CalloutVariant = Variant | 'info';
export type CalloutAppearance = 'filled' | 'outlined';

/** Maps each variant to the icon that is displayed at the start of the callout. */
const VARIANT_ICONS: Record<CalloutVariant, string> = {
  info: 'info',
  neutral: 'notifications',
  brand: 'info',
  success: 'check_circle',
  warning: 'warning',
  danger: 'emergency_home',
};

/** Shared behavior and styling for the regular and expandable callouts. */
export abstract class CalloutBase extends LitElement {
  static override readonly styles = [
    styles,
    variant,
    variantOverrides,
    appearance,
  ].map(unsafeCSS);

  /** The callout's variant. Determines the icon and color. */
  @property({ reflect: true }) variant: CalloutVariant = 'info';

  /** The callout's visual appearance. `filled` tints the whole surface; `outlined` keeps a white surface with a colored icon. */
  @property({ reflect: true }) appearance: CalloutAppearance = 'filled';

  /**
   * Returns the ARIA role for the content region based on variant.
   * Danger and warning are assertive (role="alert"), others are polite (role="status").
   */
  protected getContentRole(): 'status' | 'alert' {
    return this.variant === 'danger' || this.variant === 'warning'
      ? 'alert'
      : 'status';
  }

  /** Renders the variant icon. */
  protected renderIcon() {
    return html`
      <mh-icon
        part="icon"
        name=${VARIANT_ICONS[this.variant]}
        aria-hidden="true"
      ></mh-icon>
    `;
  }
}
