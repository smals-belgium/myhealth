import { PropertyValues, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TabBase } from './base';
import styles from './tab-link.css?inline';

/**
 * @summary A navigation tab within an `mh-tab-group`. Unlike `mh-tab`, it has no panel — activating it navigates
 *  via its `href` instead of switching a local view. It renders nothing itself; `mh-tab-group` reads its
 *  properties to render the real `<a>` in its own header.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/tabs
 * @status stable
 * @since 1.0
 *
 * @event mh-tab-link-navigate - Emitted (on the parent `mh-tab-group`) before a plain activation navigates.
 *  Cancelable — call `preventDefault()` to intercept navigation yourself, e.g. with a framework router.
 */
@customElement('mh-tab-link')
export class TabLink extends TabBase {
  static override readonly styles = unsafeCSS(styles);

  /** The link's destination URL. */
  @property() href!: string;

  /** Tells the browser where to open the link. */
  @property() target: HTMLAnchorElement['target'] = '_self';

  /** Maps to the underlying link's `rel` attribute. */
  @property() rel?: string;

  /** Tells the browser to download the linked file as this filename. */
  @property() download?: string;

  override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (
      changed.has('href') ||
      changed.has('target') ||
      changed.has('rel') ||
      changed.has('download')
    )
      this.dispatchEvent(
        new Event('mh-tab-change', { bubbles: true, composed: true }),
      );
  }

  override render() {
    return nothing;
  }
}
