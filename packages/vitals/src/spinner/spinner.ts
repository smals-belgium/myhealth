import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import { LocalizeController } from '../core/i18n';

import styles from './spinner.css?inline';

/**
 * @summary Spinners indicate that an operation is in progress when the duration is unknown. Use them for loading states
 *  where a determinate progress bar isn't practical.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/spinner
 * @status stable
 * @since 1.0
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty [--mh-spinner__size-radius=2em] - The size (width and height) of the spinner.
 * @cssproperty [--mh-spinner__size-width-track=2px] - The stroke width of the circular track.
 * @cssproperty [--mh-spinner__color-track=var(--mh-color-neutral-fill-quiet)] - The color of the background track ring.
 * @cssproperty [--mh-spinner__color-indicator=var(--mh-color-brand-fill)] - The color of the animated arc.
 * @cssproperty [--mh-spinner__animation-speed=2s] - The duration of one full rotation cycle.
 */
@customElement('mh-spinner')
export class Spinner extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  protected readonly localize = new LocalizeController(this);

  protected override render() {
    return html`
      <svg
        part="base"
        role="progressbar"
        aria-label=${this.localize.term('loading')}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="track" />
        <circle class="indicator" />
      </svg>
    `;
  }
}
