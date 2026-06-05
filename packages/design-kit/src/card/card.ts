import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './card.css?inline';
import appearance from './card.appearance.css?inline';

export type CardAppearance = 'raised' | 'outlined';

/**
 * @summary Cards group related content and actions inside a bordered container. Use them to present products, articles,
 *  user profiles, or any self-contained unit of information.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/card
 * @status stable
 * @since 1.0
 *
 * @slot - The card's main content.
 * @slot header-start - An optional element to display before the title in the header of the card.
 * @slot header-title - An optional header title for the card.
 * @slot header-end - An optional element to display after the title in the header of the card.
 * @slot header - An custom header for the card. Using this slot will override usage of the more specific slots.
 * @slot header-extras-start - An optional element to display at the start of the header-extras of the card.
 * @slot header-extras-end - An optional element to display at the end of the header-extras of the card.
 * @slot header-extras - An custom extras section to render in the header of the vertical card.
 * Using this slot will override usage of the more specific slots.
 * @slot footer-start - An optional element to display at the start of the footer of the card.
 * @slot footer-end - An optional element to display at the end of the footer of the card.
 * @slot footer - An custom footer for the card. Using this slot will override usage of the more specific slots.
 *
 * @csspart header - The container that wraps the card's header.
 * @csspart body - The container that wraps the card's main content.
 * @csspart footer - The container that wraps the card's footer.
 *
 * @cssproperty [--spacing=var(--mh-space-m)] - The amount of space around and between sections of the card.
 * Expects a single value.
 */
@customElement('mh-card')
export class Card extends LitElement {
  static override readonly styles = [styles, appearance].map(unsafeCSS);

  /** The card's visual appearance. */
  @property({ reflect: true })
  appearance: CardAppearance = 'raised';

  override render() {
    return html`<header part="header" role="presentation">
        <slot name="header-extras">
          <slot name="header-extras-start"></slot>
          <slot name="header-extras-end"></slot>
        </slot>
        <slot name="header">
          <slot name="header-start"></slot>
          <slot name="header-title"></slot>
          <slot name="header-end"></slot>
        </slot>
      </header>

      <slot part="body"></slot>

      <footer part="footer" role="presentation">
        <slot name="footer">
          <slot name="footer-start"></slot>
          <slot name="footer-end"></slot>
        </slot>
      </footer>`;
  }
}
