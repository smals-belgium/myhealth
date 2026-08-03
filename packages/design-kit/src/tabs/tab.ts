import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TabBase } from './base';
import styles from './tab.css?inline';

/**
 * @summary A single tab within an `mh-tab-group`. Its `label` (or a rich `tab-label` slot) is rendered in the
 *  group's tab list header, while its default slot content is rendered as the associated tab panel. `label` is
 *  always used as the tab panel's accessible name — even when a rich `tab-label` slot is provided — since a
 *  shadow-DOM-encapsulated panel cannot reference an id owned by a sibling custom element's shadow root.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/tabs
 * @status stable
 * @since 1.0
 *
 * @slot - The tab panel's content.
 * @slot tab-label - Optional rich content (e.g. an icon plus text) for the tab's header button. Overrides `label`
 *  visually, but `label` should still be set for the tab panel's accessible name.
 *
 * @csspart panel - The tab panel that wraps the default slot content.
 */
@customElement('mh-tab')
export class Tab extends TabBase {
  static override readonly styles = unsafeCSS(styles);

  // Set by the parent `mh-tab-group`; not meant to be set by consumers.
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ attribute: false }) panelId = '';

  override render() {
    return html`
      <div
        part="panel"
        role="tabpanel"
        id=${this.panelId}
        aria-label=${this.label || nothing}
        tabindex="0"
        ?hidden=${!this.active}
      >
        <slot></slot>
      </div>
    `;
  }
}
