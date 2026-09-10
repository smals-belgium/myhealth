import { fixture } from '@open-wc/testing';
import { html } from 'lit';
import { afterEach, vi } from 'vitest';

import { ErrorEvent as MhErrorEvent } from '../core/event';
import { adoptedStylesheet, assertAccessibility } from '../core/testing';

import { DEFAULT_SKELETON_COUNT, SKELETON_MAX_COUNT } from './skeleton';

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
    it('should render the default number of rows by default', async () => {
      const el = await fixture<HTMLElement & { count: number }>(
        html`<mh-skeleton></mh-skeleton>`,
      );
      expect(el.count).toBe(DEFAULT_SKELETON_COUNT);
      expect(
        el.shadowRoot?.querySelectorAll('[part~="indicator"]').length,
      ).toBe(DEFAULT_SKELETON_COUNT);
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
      const el = await fixture(
        html`<mh-skeleton count=${SKELETON_MAX_COUNT + 10}></mh-skeleton>`,
      );
      expect(
        el.shadowRoot?.querySelectorAll('[part~="indicator"]').length,
      ).toBe(SKELETON_MAX_COUNT);
    });

    it('should dispatch mh-error when count exceeds the maximum', async () => {
      let errorMessage = '';
      const listener = (event: Event) => {
        errorMessage = (event as MhErrorEvent).message ?? '';
      };
      document.addEventListener('mh-error', listener);
      await fixture(
        html`<mh-skeleton count=${SKELETON_MAX_COUNT + 1}></mh-skeleton>`,
      );
      document.removeEventListener('mh-error', listener);
      expect(errorMessage).toContain(String(SKELETON_MAX_COUNT));
    });

    it('should not dispatch mh-error when count is within the maximum', async () => {
      let errorDispatched = false;
      const listener = () => {
        errorDispatched = true;
      };
      document.addEventListener('mh-error', listener);
      await fixture(
        html`<mh-skeleton count=${SKELETON_MAX_COUNT}></mh-skeleton>`,
      );
      document.removeEventListener('mh-error', listener);
      expect(errorDispatched).toBe(false);
    });
  });

  describe('animation', () => {
    it('should default to "sheen"', async () => {
      const el = await fixture<HTMLElement & { animation: string }>(
        html`<mh-skeleton></mh-skeleton>`,
      );
      expect(el.animation).toBe('sheen');
      expect(el.getAttribute('animation')).toBe('sheen');
    });

    it('should reflect the animation attribute', async () => {
      const el = await fixture<HTMLElement & { animation: string }>(
        html`<mh-skeleton animation="sheen"></mh-skeleton>`,
      );
      expect(el.getAttribute('animation')).toBe('sheen');
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
