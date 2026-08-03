import { LitElement, PropertyValues, html, unsafeCSS } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { Tab } from './tab';
import { LabelStaging } from './tab-group-label-staging';
import styles from './tab-group.css?inline';
import { TabLink } from './tab-link';
import { TabLinkNavigateEvent } from './tab-link-navigate.event';
import { TabGroupSelectedChangeEvent } from './tab-selected-change.event';

type TabItem = Tab | TabLink;

let tabGroupCounter = 0;

const KEY_TO_TARGET: Record<string, 'next' | 'previous' | 'first' | 'last'> = {
  ArrowRight: 'next',
  ArrowLeft: 'previous',
  Home: 'first',
  End: 'last',
};

const indexOfTarget = (target: EventTarget | null): number =>
  Number((target as HTMLElement).dataset.index);

// Only a plain, unmodified, primary-button click on a same-tab link may be intercepted for navigation.
const isPlainActivation = (event: MouseEvent, tab: TabLink): boolean =>
  !event.ctrlKey &&
  !event.metaKey &&
  !event.shiftKey &&
  !event.altKey &&
  event.button === 0 &&
  tab.target === '_self';

/**
 * @summary Tab groups organize content into separate views where only one view is visible at a time. Implements the
 *  WAI-ARIA APG tabs pattern (manual activation) with roving tabindex keyboard navigation.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/tabs
 * @status stable
 * @since 1.0
 *
 * @event mh-tab-group-selected-change - Emitted when the selected tab changes. The `index` property carries the
 *  newly selected tab's index.
 * @event mh-tab-link-navigate - Emitted before a plain activation of an `mh-tab-link` navigates; cancelable to
 *  intercept navigation yourself, e.g. with a framework router.
 *
 * @slot - The group's `mh-tab`/`mh-tab-link` children (link children have no panel).
 *
 * @csspart header - The container that wraps the tablist.
 * @csspart tablist - The `role="tablist"` element that contains the tab headers.
 * @csspart tab - A single tab header: a `<button>` for `mh-tab`, an `<a>` for `mh-tab-link`.
 * @csspart panels - The container that wraps the `mh-tab` panels.
 *
 * @cssproperty [--mh-tab-group__indicator-color=var(--mh-color-brand-type)] - The active tab's border color.
 */
@customElement('mh-tab-group')
export class TabGroup extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  private readonly groupId = `mh-tab-group-${(tabGroupCounter += 1).toString()}`;

  /** The index of the currently selected tab. */
  @property({ type: Number, reflect: true, attribute: 'selected-index' })
  selectedIndex = 0;

  // Roving-tabindex focus target; independent of `selectedIndex` until Space/Enter (WAI-ARIA APG manual activation).
  @state() private focusedIndex = 0;

  @queryAll('[part="tab"]')
  private readonly tabButtons!: NodeListOf<HTMLElement>;

  private readonly labelStaging = new LabelStaging(this);

  private get tabs(): TabItem[] {
    return Array.from(this.children).filter(
      (el): el is TabItem =>
        el.tagName === 'MH-TAB' || el.tagName === 'MH-TAB-LINK',
    );
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mh-tab-change', this.#onChildChange);
  }

  override disconnectedCallback() {
    this.removeEventListener('mh-tab-change', this.#onChildChange);
    super.disconnectedCallback();
  }

  override willUpdate(changed: PropertyValues<this>) {
    if (changed.has('selectedIndex')) {
      // Keep the roving-tabindex anchor on the active tab when selection changes externally.
      this.focusedIndex = this.selectedIndex;
      this.#sync();
    }
  }

  #sync() {
    const { tabs } = this;

    if (tabs.length > 0 && this.selectedIndex >= tabs.length)
      this.selectedIndex = tabs.length - 1;

    tabs.forEach((tab, index) => {
      tab.tabId = `${this.groupId}-tab-${index.toString()}`;
      // Only mh-tab has a panel; mh-tab-link is navigation-only.
      if (tab instanceof Tab) {
        tab.panelId = `${this.groupId}-panel-${index.toString()}`;
        tab.active = index === this.selectedIndex;
      }
    });

    this.labelStaging.sync(tabs);
  }

  #onChildChange = () => {
    this.#sync();
    this.requestUpdate();
  };

  #selectTab(index: number) {
    const tab = this.tabs[index];
    if (tab.disabled) return;

    this.focusedIndex = index;
    if (this.selectedIndex === index) return;

    this.selectedIndex = index;
    this.dispatchEvent(new TabGroupSelectedChangeEvent(index));
  }

  #onTabClick = (event: MouseEvent) => {
    this.#selectTab(indexOfTarget(event.currentTarget));
  };

  #onTabLinkClick = (event: MouseEvent) => {
    const index = indexOfTarget(event.currentTarget);
    const tab = this.tabs[index] as TabLink;

    // <a> has no native disabled state, so a disabled link tab must block its own navigation itself.
    if (tab.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.#selectTab(index);
    this.#dispatchTabLinkNavigate(event, tab, index);
  };

  #dispatchTabLinkNavigate(event: MouseEvent, tab: TabLink, index: number) {
    if (!isPlainActivation(event, tab)) return;
    const navigate = new TabLinkNavigateEvent(index, tab.href, tab.target);
    this.dispatchEvent(navigate);
    if (navigate.defaultPrevented) event.preventDefault();
  }

  #onTabFocus = (event: FocusEvent) => {
    this.focusedIndex = indexOfTarget(event.currentTarget);
  };

  #onKeydown = (event: KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      const tab = this.tabs[this.focusedIndex];
      const isLink = tab instanceof TabLink;

      // A focused <a>'s native Enter activation already dispatches a click; don't intercept it.
      if (isLink && event.key === 'Enter') return;

      event.preventDefault();
      // <a> has no native Space-activation, so trigger it explicitly (still routes through the click handlers).
      if (isLink) this.tabButtons[this.focusedIndex].click();
      else this.#selectTab(this.focusedIndex);
      return;
    }

    if (!Object.hasOwn(KEY_TO_TARGET, event.key)) return;

    event.preventDefault();
    this.#moveFocus(KEY_TO_TARGET[event.key]);
  };

  #moveFocus(target: 'next' | 'previous' | 'first' | 'last') {
    const { tabs } = this;
    const enabled = tabs.reduce<number[]>((acc, tab, index) => {
      if (!tab.disabled) acc.push(index);
      return acc;
    }, []);
    if (enabled.length === 0) return;

    const count = enabled.length;
    const pos = Math.max(0, enabled.indexOf(this.focusedIndex));
    let [nextIndex] = enabled;
    if (target === 'last') nextIndex = enabled[count - 1];
    else if (target === 'next') nextIndex = enabled[(pos + 1) % count];
    else if (target === 'previous')
      nextIndex = enabled[(pos - 1 + count) % count];

    this.focusedIndex = nextIndex;
    // Focusing the next tab is best-effort.
    this.updateComplete
      .then(() => this.tabButtons[nextIndex].focus())
      .catch(() => undefined);
  }

  #renderTab(tab: TabItem, index: number) {
    const selected = index === this.selectedIndex ? 'true' : 'false';
    const tabindex = index === this.focusedIndex ? '0' : '-1';
    const label = html`<slot name="tab-label-${index}">${tab.label}</slot>`;

    // Aria-controls is omitted intentionally: panels live in mh-tab's shadow DOM, so cross-root ARIA ID refs don't work.
    if (tab instanceof TabLink)
      return html`
        <a
          part="tab"
          role="tab"
          id=${tab.tabId}
          data-index=${index}
          href=${tab.href}
          target=${tab.target}
          rel=${ifDefined(tab.rel)}
          download=${ifDefined(tab.download)}
          aria-selected=${selected}
          aria-disabled=${tab.disabled ? 'true' : 'false'}
          tabindex=${tab.disabled ? '-1' : tabindex}
          @click=${this.#onTabLinkClick}
          @focus=${this.#onTabFocus}
        >
          ${label}
        </a>
      `;

    return html`
      <button
        part="tab"
        role="tab"
        id=${tab.tabId}
        data-index=${index}
        aria-selected=${selected}
        tabindex=${tabindex}
        ?disabled=${tab.disabled}
        @click=${this.#onTabClick}
        @focus=${this.#onTabFocus}
      >
        ${label}
      </button>
    `;
  }

  override render() {
    const { tabs } = this;
    const tabButtons = tabs.map((tab, index) => this.#renderTab(tab, index));

    return html`
      <div
        part="header"
        role="presentation"
      >
        <div
          part="tablist"
          role="tablist"
          aria-orientation="horizontal"
          @keydown=${this.#onKeydown}
        >
          ${tabButtons}
        </div>
      </div>
      <div part="panels">
        <slot @slotchange=${this.#onChildChange}></slot>
      </div>
    `;
  }
}
