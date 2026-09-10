export interface TabLinkNavigateDetail {
  /** The index of the tab that was activated. */
  index: number;
  /** The link's resolved `href`. */
  href: string;
  /** The link's `target`. */
  target: string;
}

/** Dispatched by `mh-tab-group` before a plain (unmodified, primary-button, non-`_blank`) activation of an
 * `mh-tab-link` navigates. Cancelable — call `preventDefault()` to intercept navigation yourself (e.g. with a
 * framework router) instead of letting the underlying anchor navigate natively. */
export class TabLinkNavigateEvent extends CustomEvent<TabLinkNavigateDetail> {
  /** Shorthand for `event.detail.index`. */
  get index(): number {
    return this.detail.index;
  }

  /** Shorthand for `event.detail.href`. */
  get href(): string {
    return this.detail.href;
  }

  // No `target` getter here: `Event.target` is already a native property, so this class only exposes the
  // link's target via `event.detail.target` to avoid shadowing it.

  constructor(index: number, href: string, target: string) {
    super('mh-tab-link-navigate', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: { index, href, target },
    });
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'mh-tab-link-navigate': TabLinkNavigateEvent;
  }
}
