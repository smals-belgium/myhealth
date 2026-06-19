import { fixture } from '@open-wc/testing';
import { html } from 'lit';
import { afterEach, vi } from 'vitest';

import { adoptedStylesheet, assertAccessibility } from '../core/testing';

import { SKELETON_MAX_COUNT } from './skeleton';

describe('skeleton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('accessibility', () => {
    it('should pass accessibility tests', async () => {
      assertAccessibility(await fixture(html`<mh-skeleton></mh-skeleton>`));
    });

    it('should have role="progressbar" on the host', async () => {
      const el = await fixture(html`<mh-skeleton></mh-skeleton>`);
      expect(el.getAttribute('role')).toBe('progressbar');
    });

    it('should be marked as busy', async () => {
      const el = await fixture(html`<mh-skeleton></mh-skeleton>`);
      expect(el.getAttribute('aria-busy')).toBe('true');
    });

    it('should have an aria-label for loading', async () => {
      const el = await fixture(html`<mh-skeleton lang="en"></mh-skeleton>`);
      expect(el.getAttribute('aria-label')).toBe('Loading');
    });

    it('should expose a single loading status for multiple rows', async () => {
      const el = await fixture(
        html`<mh-skeleton
          lang="en"
          count="5"
        ></mh-skeleton>`,
      );
      expect(el.getAttribute('role')).toBe('progressbar');
      expect(el.getAttribute('aria-label')).toBe('Loading');
    });
  });

  describe('CSS parts', () => {
    it('should have an indicator part', async () => {
      const el = await fixture(html`<mh-skeleton></mh-skeleton>`);
      expect(
        el.shadowRoot?.querySelector('[part~="indicator"]'),
      ).not.toBeNull();
    });
  });

  describe('count', () => {
    it('should render a single row by default', async () => {
      const el = await fixture<HTMLElement & { count: number }>(
        html`<mh-skeleton></mh-skeleton>`,
      );
      expect(el.count).toBe(1);
      expect(
        el.shadowRoot?.querySelectorAll('[part~="indicator"]').length,
      ).toBe(1);
    });

    it('should render one row per count', async () => {
      const el = await fixture(html`<mh-skeleton count="4"></mh-skeleton>`);
      expect(
        el.shadowRoot?.querySelectorAll('[part~="indicator"]').length,
      ).toBe(4);
    });

    it('should reflect the count attribute', async () => {
      const el = await fixture(html`<mh-skeleton count="3"></mh-skeleton>`);
      expect(el.getAttribute('count')).toBe('3');
    });

    it('should clamp the rendered rows to the maximum', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {
        return;
      });
      const el = await fixture(
        html`<mh-skeleton count=${SKELETON_MAX_COUNT + 10}></mh-skeleton>`,
      );
      expect(
        el.shadowRoot?.querySelectorAll('[part~="indicator"]').length,
      ).toBe(SKELETON_MAX_COUNT);
    });

    it('should warn when count exceeds the maximum', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
        return;
      });
      await fixture(
        html`<mh-skeleton count=${SKELETON_MAX_COUNT + 1}></mh-skeleton>`,
      );
      expect(warn).toHaveBeenCalledOnce();
      expect(warn.mock.calls[0][0]).toContain(String(SKELETON_MAX_COUNT));
    });

    it('should not warn when count is within the maximum', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
        return;
      });
      await fixture(
        html`<mh-skeleton count=${SKELETON_MAX_COUNT}></mh-skeleton>`,
      );
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe('effect', () => {
    it('should default to "none"', async () => {
      const el = await fixture<HTMLElement & { effect: string }>(
        html`<mh-skeleton></mh-skeleton>`,
      );
      expect(el.effect).toBe('none');
      expect(el.getAttribute('effect')).toBe('none');
    });

    it('should reflect the effect attribute', async () => {
      const el = await fixture<HTMLElement & { effect: string }>(
        html`<mh-skeleton effect="sheen"></mh-skeleton>`,
      );
      expect(el.getAttribute('effect')).toBe('sheen');
    });
  });

  describe('rendering', () => {
    it('should disable animations when reduced motion is preferred', async () => {
      const el = await fixture(html`<mh-skeleton></mh-skeleton>`);
      expect(adoptedStylesheet(el).includes('prefers-reduced-motion')).toBe(
        true,
      );
    });
  });
});
