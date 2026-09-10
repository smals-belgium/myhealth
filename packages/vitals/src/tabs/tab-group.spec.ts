import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility } from '../core/testing';

import './tab';
import './tab-group';
import './tab-link';
import type { Tab } from './tab';
import type { TabGroup } from './tab-group';
import type { TabLinkNavigateEvent } from './tab-link-navigate.event';
import type { TabGroupSelectedChangeEvent } from './tab-selected-change.event';

const threeTabs = html`
  <mh-tab-group>
    <mh-tab label="One">Panel one</mh-tab>
    <mh-tab label="Two">Panel two</mh-tab>
    <mh-tab label="Three">Panel three</mh-tab>
  </mh-tab-group>
`;

const mixedTabs = html`
  <mh-tab-group>
    <mh-tab label="One">Panel one</mh-tab>
    <mh-tab-link
      label="Two"
      href="/two"
    ></mh-tab-link>
  </mh-tab-group>
`;

const tabButtons = (el: TabGroup) =>
  Array.from(
    el.shadowRoot?.querySelectorAll<HTMLButtonElement>('[part="tab"]') ?? [],
  );

const tablist = (el: TabGroup) =>
  el.shadowRoot?.querySelector<HTMLDivElement>('[part="tablist"]');

const pressKey = (el: TabGroup, key: string) => {
  tablist(el)?.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true }),
  );
};

describe('mh-tab-group', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(await fixture(threeTabs));
    });

    it('passes accessibility tests with a mix of content and link tabs', async () => {
      await assertAccessibility(await fixture(mixedTabs));
    });

    it('passes accessibility tests with a disabled tab', async () => {
      await assertAccessibility(
        await fixture(html`
          <mh-tab-group>
            <mh-tab label="One">Panel one</mh-tab>
            <mh-tab
              label="Two"
              disabled
              >Panel two</mh-tab
            >
          </mh-tab-group>
        `),
      );
    });
  });

  describe('rendering', () => {
    it('renders one tab button per mh-tab child', async () => {
      const el = await fixture<TabGroup>(threeTabs);

      expect(tabButtons(el)).toHaveLength(3);
    });

    it('renders the label text inside the tab button', async () => {
      const el = await fixture<TabGroup>(threeTabs);

      expect(tabButtons(el)[0].textContent?.trim()).toBe('One');
    });

    it('marks the selected tab as aria-selected and others as not selected', async () => {
      const el = await fixture<TabGroup>(threeTabs);
      const buttons = tabButtons(el);

      expect(buttons[0].getAttribute('aria-selected')).toBe('true');
      expect(buttons[1].getAttribute('aria-selected')).toBe('false');
      expect(buttons[2].getAttribute('aria-selected')).toBe('false');
    });

    it('marks a disabled tab button as disabled', async () => {
      const el = await fixture<TabGroup>(html`
        <mh-tab-group>
          <mh-tab label="One">Panel one</mh-tab>
          <mh-tab
            label="Two"
            disabled
            >Panel two</mh-tab
          >
        </mh-tab-group>
      `);

      expect(tabButtons(el)[1].disabled).toBe(true);
    });

    it('wires each tab button id and syncs each panel accessible name/active state', async () => {
      const el = await fixture<TabGroup>(threeTabs);
      const tabs = Array.from(el.querySelectorAll<Tab>('mh-tab'));
      await Promise.all(tabs.map(tab => tab.updateComplete));
      const buttons = tabButtons(el);

      tabs.forEach((tab, index) => {
        expect(buttons[index].id).toBe(tab.tabId);
        expect(tab.panelId).toBeTruthy();
      });
      expect(tabs[0].active).toBe(true);
      expect(tabs[1].active).toBe(false);
      expect(tabs[2].active).toBe(false);
    });
  });

  describe('selection', () => {
    it('defaults selectedIndex to 0', async () => {
      const el = await fixture<TabGroup>(threeTabs);

      expect(el.selectedIndex).toBe(0);
    });

    it('gives tabindex="0" to the initially selected tab when selected-index is set declaratively', async () => {
      const el = await fixture<TabGroup>(html`
        <mh-tab-group selected-index="2">
          <mh-tab label="One">Panel one</mh-tab>
          <mh-tab label="Two">Panel two</mh-tab>
          <mh-tab label="Three">Panel three</mh-tab>
        </mh-tab-group>
      `);
      const buttons = tabButtons(el);

      expect(buttons[2].getAttribute('tabindex')).toBe('0');
      expect(buttons[0].getAttribute('tabindex')).toBe('-1');
    });

    it('moves tabindex="0" to the newly selected tab when selectedIndex changes programmatically', async () => {
      const el = await fixture<TabGroup>(threeTabs);

      el.selectedIndex = 2;
      await el.updateComplete;
      const buttons = tabButtons(el);

      expect(buttons[2].getAttribute('tabindex')).toBe('0');
      expect(buttons[0].getAttribute('tabindex')).toBe('-1');
    });

    it('selects a tab on click and emits mh-tab-group-selected-change', async () => {
      const el = await fixture<TabGroup>(threeTabs);

      const changed = oneEvent(
        el,
        'mh-tab-group-selected-change',
      ) as Promise<TabGroupSelectedChangeEvent>;
      tabButtons(el)[1].click();
      const event = await changed;

      expect(event.index).toBe(1);
      expect(el.selectedIndex).toBe(1);
    });

    it('does not select a disabled tab on click', async () => {
      const el = await fixture<TabGroup>(html`
        <mh-tab-group>
          <mh-tab label="One">Panel one</mh-tab>
          <mh-tab
            label="Two"
            disabled
            >Panel two</mh-tab
          >
        </mh-tab-group>
      `);
      const handler = vi.fn();
      el.addEventListener('mh-tab-group-selected-change', handler);

      tabButtons(el)[1].click();

      expect(handler).not.toHaveBeenCalled();
      expect(el.selectedIndex).toBe(0);
    });
  });

  describe('keyboard navigation', () => {
    it('moves the roving tabindex to the next tab with ArrowRight without changing selection', async () => {
      const el = await fixture<TabGroup>(threeTabs);

      pressKey(el, 'ArrowRight');
      await el.updateComplete;
      const buttons = tabButtons(el);

      expect(buttons[1].getAttribute('tabindex')).toBe('0');
      expect(buttons[0].getAttribute('tabindex')).toBe('-1');
      expect(el.selectedIndex).toBe(0);
    });

    it('wraps focus from the last to the first tab with ArrowRight', async () => {
      const el = await fixture<TabGroup>(threeTabs);

      pressKey(el, 'ArrowRight');
      pressKey(el, 'ArrowRight');
      pressKey(el, 'ArrowRight');
      await el.updateComplete;

      expect(tabButtons(el)[0].getAttribute('tabindex')).toBe('0');
    });

    it('wraps focus from the first to the last tab with ArrowLeft', async () => {
      const el = await fixture<TabGroup>(threeTabs);

      pressKey(el, 'ArrowLeft');
      await el.updateComplete;

      expect(tabButtons(el)[2].getAttribute('tabindex')).toBe('0');
    });

    it('moves focus to the last tab with End', async () => {
      const el = await fixture<TabGroup>(threeTabs);

      pressKey(el, 'End');
      await el.updateComplete;

      expect(tabButtons(el)[2].getAttribute('tabindex')).toBe('0');
    });

    it('moves focus back to the first tab with Home', async () => {
      const el = await fixture<TabGroup>(threeTabs);

      pressKey(el, 'End');
      pressKey(el, 'Home');
      await el.updateComplete;

      expect(tabButtons(el)[0].getAttribute('tabindex')).toBe('0');
    });

    it('skips disabled tabs during arrow navigation', async () => {
      const el = await fixture<TabGroup>(html`
        <mh-tab-group>
          <mh-tab label="One">Panel one</mh-tab>
          <mh-tab
            label="Two"
            disabled
            >Panel two</mh-tab
          >
          <mh-tab label="Three">Panel three</mh-tab>
        </mh-tab-group>
      `);

      pressKey(el, 'ArrowRight');
      await el.updateComplete;
      const buttons = tabButtons(el);

      expect(buttons[2].getAttribute('tabindex')).toBe('0');
      expect(buttons[1].getAttribute('tabindex')).toBe('-1');
    });

    it('selects the focused tab on Enter', async () => {
      const el = await fixture<TabGroup>(threeTabs);

      const changed = oneEvent(
        el,
        'mh-tab-group-selected-change',
      ) as Promise<TabGroupSelectedChangeEvent>;
      pressKey(el, 'ArrowRight');
      pressKey(el, 'Enter');
      const event = await changed;

      expect(event.index).toBe(1);
      expect(el.selectedIndex).toBe(1);
    });

    it('selects the focused tab on Space', async () => {
      const el = await fixture<TabGroup>(threeTabs);

      const changed = oneEvent(
        el,
        'mh-tab-group-selected-change',
      ) as Promise<TabGroupSelectedChangeEvent>;
      pressKey(el, 'ArrowRight');
      pressKey(el, ' ');
      const event = await changed;

      expect(event.index).toBe(1);
      expect(el.selectedIndex).toBe(1);
    });
  });

  describe('rich labels', () => {
    it('moves a rich tab-label node into a named slot inside the tab button', async () => {
      const el = await fixture<TabGroup>(html`
        <mh-tab-group>
          <mh-tab>
            <span slot="tab-label"><strong>Rich</strong> label</span>
            Panel one
          </mh-tab>
          <mh-tab label="Two">Panel two</mh-tab>
        </mh-tab-group>
      `);

      const namedSlot =
        tabButtons(el)[0].querySelector<HTMLSlotElement>('slot');
      expect(namedSlot?.name).toBe('tab-label-0');

      const assigned = namedSlot?.assignedElements() ?? [];
      expect(assigned).toHaveLength(1);
      expect(assigned[0].textContent?.trim()).toBe('Rich label');
    });
  });

  describe('link tabs', () => {
    it('renders an mh-tab-link as an <a> with the expected attributes', async () => {
      const el = await fixture<TabGroup>(html`
        <mh-tab-group>
          <mh-tab label="One">Panel one</mh-tab>
          <mh-tab-link
            label="Two"
            href="/two"
            target="_blank"
            rel="noopener"
            download="file.pdf"
          ></mh-tab-link>
        </mh-tab-group>
      `);
      const [, link] = tabButtons(el);

      expect(link.tagName).toBe('A');
      expect(link.getAttribute('role')).toBe('tab');
      expect(link.getAttribute('href')).toBe('/two');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener');
      expect(link.getAttribute('download')).toBe('file.pdf');
      expect(link.getAttribute('aria-selected')).toBe('false');
    });

    it('marks a disabled link tab as aria-disabled and removes it from the tab order', async () => {
      const el = await fixture<TabGroup>(html`
        <mh-tab-group>
          <mh-tab label="One">Panel one</mh-tab>
          <mh-tab-link
            label="Two"
            href="/two"
            disabled
          ></mh-tab-link>
        </mh-tab-group>
      `);
      const [, link] = tabButtons(el);

      expect(link.getAttribute('aria-disabled')).toBe('true');
      expect(link.getAttribute('tabindex')).toBe('-1');
    });

    it('skips a disabled link tab during arrow navigation', async () => {
      const el = await fixture<TabGroup>(html`
        <mh-tab-group>
          <mh-tab label="One">Panel one</mh-tab>
          <mh-tab-link
            label="Two"
            href="/two"
            disabled
          ></mh-tab-link>
          <mh-tab label="Three">Panel three</mh-tab>
        </mh-tab-group>
      `);

      pressKey(el, 'ArrowRight');
      await el.updateComplete;

      expect(tabButtons(el)[2].getAttribute('tabindex')).toBe('0');
    });

    it('selects a link tab and emits mh-tab-link-navigate on a plain click', async () => {
      const el = await fixture<TabGroup>(mixedTabs);

      const selected = oneEvent(
        el,
        'mh-tab-group-selected-change',
      ) as Promise<TabGroupSelectedChangeEvent>;
      const navigated = oneEvent(
        el,
        'mh-tab-link-navigate',
      ) as Promise<TabLinkNavigateEvent>;
      tabButtons(el)[1].click();
      const [selectedEvent, navigateEvent] = await Promise.all([
        selected,
        navigated,
      ]);

      expect(selectedEvent.index).toBe(1);
      expect(navigateEvent.href).toBe('/two');
      expect(el.selectedIndex).toBe(1);
    });

    it('selects a link tab on Space and emits mh-tab-link-navigate', async () => {
      const el = await fixture<TabGroup>(mixedTabs);

      const navigated = oneEvent(el, 'mh-tab-link-navigate');
      pressKey(el, 'ArrowRight');
      pressKey(el, ' ');
      await navigated;

      expect(el.selectedIndex).toBe(1);
    });

    it('does not call preventDefault for Enter on a focused link tab', async () => {
      const el = await fixture<TabGroup>(mixedTabs);
      pressKey(el, 'ArrowRight');
      await el.updateComplete;

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      tablist(el)?.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
    });

    it('cancels the underlying click when mh-tab-link-navigate is prevented', async () => {
      const el = await fixture<TabGroup>(mixedTabs);
      el.addEventListener('mh-tab-link-navigate', navigateEvent =>
        navigateEvent.preventDefault(),
      );

      const click = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        button: 0,
      });
      tabButtons(el)[1].dispatchEvent(click);

      expect(click.defaultPrevented).toBe(true);
    });

    it('does not emit mh-tab-link-navigate on a modified click', async () => {
      const el = await fixture<TabGroup>(mixedTabs);
      const handler = vi.fn();
      el.addEventListener('mh-tab-link-navigate', handler);

      const click = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        button: 0,
        ctrlKey: true,
      });
      tabButtons(el)[1].dispatchEvent(click);

      expect(handler).not.toHaveBeenCalled();
    });

    it('does not emit mh-tab-link-navigate when target is not _self', async () => {
      const el = await fixture<TabGroup>(html`
        <mh-tab-group>
          <mh-tab label="One">Panel one</mh-tab>
          <mh-tab-link
            label="Two"
            href="/two"
            target="_blank"
          ></mh-tab-link>
        </mh-tab-group>
      `);
      const handler = vi.fn();
      el.addEventListener('mh-tab-link-navigate', handler);

      tabButtons(el)[1].click();

      expect(handler).not.toHaveBeenCalled();
    });

    it('does not select or navigate on a disabled link tab click', async () => {
      const el = await fixture<TabGroup>(html`
        <mh-tab-group>
          <mh-tab label="One">Panel one</mh-tab>
          <mh-tab-link
            label="Two"
            href="/two"
            disabled
          ></mh-tab-link>
        </mh-tab-group>
      `);
      const handler = vi.fn();
      el.addEventListener('mh-tab-link-navigate', handler);

      tabButtons(el)[1].click();

      expect(handler).not.toHaveBeenCalled();
      expect(el.selectedIndex).toBe(0);
    });
  });
});
