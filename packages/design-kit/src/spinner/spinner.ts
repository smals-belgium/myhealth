import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import { LocalizeController } from '../core/i18n';
import styles from './spinner.css?inline';

/**
 * @summary Spinners indicate that an operation is in progress when the duration is unknown. Use them for loading states
 *  where a determinate progress bar isn't practical.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/spinner
 * @status stable
 * @since 1.0
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --track-width - The width of the track.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-color - The color of the spinner's indicator.
 * @cssproperty --size - The size of the visual.
 * @cssproperty --speed - The time it takes for the spinner to complete one animation cycle.
 */
@customElement('mh-spinner')
export class Spinner extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  private readonly localize = new LocalizeController(this);

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
