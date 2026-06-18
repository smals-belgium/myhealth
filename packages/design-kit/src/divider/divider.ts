import { LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Loudness, Orientation } from '../core';

import styles from './divider.css?inline';

/**
 * @summary Dividers visually separate or group adjacent elements with a horizontal or vertical line. Use them to
 *  establish rhythm and hierarchy within menus, toolbars, and layouts.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/divider
 * @status stable
 * @since 1.0
 *
 * @cssproperty --color - The color of the divider.
 * @cssproperty --width - The width of the divider.
 * @cssproperty --spacing - The spacing of the divider.
 */
@customElement('mh-divider')
export class Divider extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  /** Sets the divider's loudness. Its base color is always 'neutral'. */
  @property({ reflect: true }) loudness: Loudness = 'normal';

  /** Sets the divider's orientation. */
  @property({ reflect: true })
  orientation: Orientation = 'horizontal';

  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'separator');
  }

  override update(props: PropertyValues<this>) {
    super.update(props);

    if (props.has('orientation'))
      this.setAttribute('aria-orientation', this.orientation);
  }
}
