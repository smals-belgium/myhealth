import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, defaultSlot, part } from '../core/testing';

import './tab';
import type { Tab } from './tab';

describe('mh-tab', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      const el = await fixture<Tab>(
        html`<mh-tab active>Panel content</mh-tab>`,
      );
      el.tabId = 'tab-1';
      el.panelId = 'panel-1';
      await el.updateComplete;

      await assertAccessibility(el);
    });
  });

  describe('defaults', () => {
    it('has an empty label and is not disabled', async () => {
      const el = await fixture<Tab>(html`<mh-tab>Panel content</mh-tab>`);

      expect(el.label).toBe('');
      expect(el.disabled).toBe(false);
      expect(el.active).toBe(false);
    });
  });

  describe('panel', () => {
    it('renders a tabpanel with a matching id and accessible name', async () => {
      const el = await fixture<Tab>(
        html`<mh-tab
          active
          label="One"
          >Panel content</mh-tab
        >`,
      );
      el.panelId = 'panel-1';
      await el.updateComplete;

      const panel = part<HTMLDivElement>('panel', el);
      expect(panel?.getAttribute('role')).toBe('tabpanel');
      expect(panel?.id).toBe('panel-1');
      expect(panel?.getAttribute('aria-label')).toBe('One');
    });

    it('omits aria-label when no label is set', async () => {
      const el = await fixture<Tab>(
        html`<mh-tab active>Panel content</mh-tab>`,
      );

      expect(part('panel', el)?.hasAttribute('aria-label')).toBe(false);
    });

    it('is hidden when not active', async () => {
      const el = await fixture<Tab>(html`<mh-tab>Panel content</mh-tab>`);

      expect(part('panel', el)?.hasAttribute('hidden')).toBe(true);
    });

    it('is visible when active', async () => {
      const el = await fixture<Tab>(
        html`<mh-tab active>Panel content</mh-tab>`,
      );

      expect(part('panel', el)?.hasAttribute('hidden')).toBe(false);
    });

    it('renders the default slot content', async () => {
      const el = await fixture<Tab>(
        html`<mh-tab active>Panel content</mh-tab>`,
      );

      expect(defaultSlot(el)).not.toBeNull();
    });
  });

  describe('mh-tab-change', () => {
    it('dispatches mh-tab-change when the label changes', async () => {
      const el = await fixture<Tab>(html`<mh-tab>Panel content</mh-tab>`);

      const changed = oneEvent(el, 'mh-tab-change');
      el.label = 'New label';
      await changed;
    });

    it('dispatches mh-tab-change when disabled changes', async () => {
      const el = await fixture<Tab>(html`<mh-tab>Panel content</mh-tab>`);

      const changed = oneEvent(el, 'mh-tab-change');
      el.disabled = true;
      await changed;
    });
  });
});
