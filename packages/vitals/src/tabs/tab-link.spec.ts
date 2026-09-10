import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility } from '../core/testing';

import './tab-link';
import type { TabLink } from './tab-link';

describe('mh-tab-link', () => {
  describe('defaults', () => {
    it('has an empty label, is not disabled and targets _self', async () => {
      const el = await fixture<TabLink>(html`<mh-tab-link></mh-tab-link>`);

      expect(el.label).toBe('');
      expect(el.disabled).toBe(false);
      expect(el.target).toBe('_self');
    });
  });

  describe('rendering', () => {
    it('renders nothing itself', async () => {
      const el = await fixture<TabLink>(html`<mh-tab-link></mh-tab-link>`);

      expect(el.shadowRoot?.querySelector(':scope > *:not(style)')).toBeNull();
    });

    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(html`<mh-tab-link></mh-tab-link>`),
      );
    });
  });

  describe('mh-tab-change', () => {
    it('dispatches mh-tab-change when the label changes', async () => {
      const el = await fixture<TabLink>(html`<mh-tab-link></mh-tab-link>`);

      const changed = oneEvent(el, 'mh-tab-change');
      el.label = 'New label';
      await changed;
    });

    it('dispatches mh-tab-change when disabled changes', async () => {
      const el = await fixture<TabLink>(html`<mh-tab-link></mh-tab-link>`);

      const changed = oneEvent(el, 'mh-tab-change');
      el.disabled = true;
      await changed;
    });

    it('dispatches mh-tab-change when href changes', async () => {
      const el = await fixture<TabLink>(html`<mh-tab-link></mh-tab-link>`);

      const changed = oneEvent(el, 'mh-tab-change');
      el.href = '/new-url';
      await changed;
    });
  });
});
