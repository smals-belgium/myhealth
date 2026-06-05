import { elementUpdated, fixture } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility } from '../core/testing/index.js';

import './divider';
import type { Divider } from './divider.js';

describe('divider', () => {
  const setup = (tpl = html`<mh-divider></mh-divider>`): Promise<Divider> =>
    fixture(tpl);

  describe('accessibility', () => {
    it(`passes accessibility tests`, async () => {
      assertAccessibility(await setup());
    });

    it(`has role="separator"`, async () => {
      expect((await setup()).getAttribute('role')).toBe('separator');
    });

    it('sets aria-orientation to match orientation', async () => {
      expect((await setup()).getAttribute('aria-orientation')).toBe(
        'horizontal',
      );
    });
  });

  describe('orientation', () => {
    it(`has default orientation "horizontal"`, async () => {
      const el = await setup();

      expect(el.orientation).toBe('horizontal');
      expect(el.getAttribute('orientation')).toBe('horizontal');
    });

    it(`reflects orientation to an attribute`, async () => {
      const el = await setup(
        html`<mh-divider orientation="vertical"></mh-divider>`,
      );

      expect(el.orientation).toBe('vertical');
      expect(el.getAttribute('orientation')).toBe('vertical');
    });

    it(`updates aria-orientation when orientation changes`, async () => {
      const el = await setup();
      el.orientation = 'vertical';
      await elementUpdated(el);

      expect(el.getAttribute('aria-orientation')).toBe('vertical');
    });
  });

  describe('loudness', () => {
    it(`has default loudness "normal"`, async () => {
      const el = await setup();

      expect(el.loudness).toBe('normal');
      expect(el.getAttribute('loudness')).toBe('normal');
    });

    it(`reflects loudness to an attribute`, async () => {
      const el = await setup(html`<mh-divider loudness="quiet"></mh-divider>`);

      expect(el.loudness).toBe('quiet');
      expect(el.getAttribute('loudness')).toBe('quiet');
    });
  });
});
