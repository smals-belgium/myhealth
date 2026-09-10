import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

export abstract class TabBase extends LitElement {
  /** The tab's header label. Ignored visually when a `tab-label` slot is provided. */
  @property({ reflect: true }) label = '';

  /** Disables the tab, excluding it from selection and keyboard navigation. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  // Set by the parent `mh-tab-group`; not meant to be set by consumers.
  @property({ attribute: false }) tabId = '';

  override updated(changed: PropertyValues<this>) {
    if (changed.has('label') || changed.has('disabled'))
      this.dispatchEvent(
        new Event('mh-tab-change', { bubbles: true, composed: true }),
      );
  }
}
