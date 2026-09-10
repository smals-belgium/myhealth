import { LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Loudness, Orientation } from '../core';

import styles from './divider.css?inline';

/**
 * @summary Dividers visually separate or group adjacent elements with a horizontal or vertical line. Use them to
 *  establish rhythm and hierarchy within menus, toolbars, and layouts.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/divider
 * @status stable
 * @since 1.0
 *
 * @cssproperty [--mh-divider__color=var(--mh-color-neutral-border)] - The color of the divider line.
 * @cssproperty [--mh-divider__size-width=var(--mh-border-width-s)] - The thickness of the divider line.
 * @cssproperty [--mh-divider__size-space=var(--mh-space-m)] - The margin on either side of the divider.
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
