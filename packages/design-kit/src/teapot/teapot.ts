import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './teapot.css?inline';

/**
 * @summary Is a teapot.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/teapot
 * @status stable
 * @since 1.0
 *
 * @cssproperty --color - The color of the teapot.
 */
@customElement('mh-teapot')
export class Teapot extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'teapot');
  }

  override render() {
    return html`<h1>I'm a <slot></slot> teapot !</h1>`;
  }
}
