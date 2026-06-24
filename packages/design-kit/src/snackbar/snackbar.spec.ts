import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { liveAnnouncer } from '../core/live-announcer';
import { assertAccessibility, defaultSlot, part } from '../core/testing';

import './snackbar';
import type { SnackbarDismissedEvent } from './snackbar-dismissed.event.js';
import type { Snackbar } from './snackbar.js';

describe('snackbar', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);
      el.open('Message archived');

      await assertAccessibility(el);
    });
  });

  describe('open / dismiss', () => {
    it('is closed by default', async () => {
      const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

      expect(el.isOpen).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('opens with a message and reflects the open attribute', async () => {
      const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

      el.open('Saved');

      expect(el.isOpen).toBe(true);
      expect(el.hasAttribute('open')).toBe(true);
      expect(el.message).toBe('Saved');
    });

    it('dismisses and clears the open attribute', async () => {
      const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

      el.open('Saved');
      el.dismiss();

      expect(el.isOpen).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('renders the default slot when provided', async () => {
      const el = await fixture<Snackbar>(
        html`<mh-snackbar><span>Custom content</span></mh-snackbar>`,
      );
      el.open('Fallback');

      expect(defaultSlot(el)?.assignedElements().length).toBe(1);
    });
  });

  describe('config', () => {
    it('announces the message with the configured politeness', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

        el.open('Urgent', { politeness: 'assertive' });
        vi.advanceTimersByTime(100);

        const { region } = liveAnnouncer;
        expect(region?.getAttribute('aria-live')).toBe('assertive');
        expect(region?.textContent).toBe('Urgent');
      } finally {
        vi.useRealTimers();
      }
    });

    it('auto-dismisses after the default 3s duration', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

        el.open('Saved');
        expect(el.isOpen).toBe(true);

        vi.advanceTimersByTime(3000);

        expect(el.isOpen).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });

    it('stays open when the duration is 0', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

        el.open('Saved', { duration: 0 });
        vi.advanceTimersByTime(10000);

        expect(el.isOpen).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });

    it('resets the auto-dismiss timer while the pointer hovers', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

        el.open('Saved', { duration: 3000 });
        vi.advanceTimersByTime(2000);

        const surface = part('snackbar', el);
        surface?.dispatchEvent(new Event('pointerenter'));
        // The timer is paused while hovering, so it should not dismiss.
        vi.advanceTimersByTime(5000);
        expect(el.isOpen).toBe(true);

        // Leaving restarts the full duration.
        surface?.dispatchEvent(new Event('pointerleave'));
        vi.advanceTimersByTime(2999);
        expect(el.isOpen).toBe(true);

        vi.advanceTimersByTime(1);
        expect(el.isOpen).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('single instance', () => {
    it('dismisses a previously open snackbar when another opens', async () => {
      const first = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);
      const second = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

      first.open('First');
      second.open('Second');

      expect(first.isOpen).toBe(false);
      expect(second.isOpen).toBe(true);
    });
  });

  describe('live region', () => {
    it('announces in a shared visually hidden region in the document body', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

        el.open('Saved');
        vi.advanceTimersByTime(100);

        const { region } = liveAnnouncer;
        expect(region?.parentElement).toBe(document.body);
        expect(region?.getAttribute('aria-live')).toBe('polite');
        expect(region?.getAttribute('aria-atomic')).toBe('true');
        expect(region?.textContent).toBe('Saved');
      } finally {
        vi.useRealTimers();
      }
    });

    it('hides the visual message from assistive technology to avoid double announcement', async () => {
      const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

      el.open('Saved');
      await el.updateComplete;

      expect(part('message', el)?.getAttribute('aria-hidden')).toBe('true');
    });

    it('clears the region before injecting so identical messages re-announce', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

        el.open('Message archived');
        vi.advanceTimersByTime(100);
        expect(liveAnnouncer.region?.textContent).toBe('Message archived');

        // Re-opening clears the region first, then re-injects the same text.
        el.open('Message archived');
        expect(liveAnnouncer.region?.textContent).toBe('');

        vi.advanceTimersByTime(100);
        expect(liveAnnouncer.region?.textContent).toBe('Message archived');
      } finally {
        vi.useRealTimers();
      }
    });

    it('keeps the announcement after the snackbar dismisses so polite messages are not lost', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

        el.open('Message archived');
        vi.advanceTimersByTime(100);
        el.dismiss();

        expect(el.isOpen).toBe(false);
        expect(liveAnnouncer.region?.textContent).toBe('Message archived');
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('events', () => {
    it('emits mh-snackbar-dismissed with the close-button reason', async () => {
      const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);
      el.open('Saved');

      const dismissed = oneEvent(
        el,
        'mh-snackbar-dismissed',
      ) as Promise<SnackbarDismissedEvent>;
      part<HTMLElement>('close', el)?.click();
      const event = await dismissed;

      expect(event.reason).toBe('close-button');
      expect(el.isOpen).toBe(false);
    });

    it('emits mh-snackbar-dismissed with the timeout reason', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);

        const dismissed = oneEvent(
          el,
          'mh-snackbar-dismissed',
        ) as Promise<SnackbarDismissedEvent>;
        el.open('Saved', { duration: 1000 });
        vi.advanceTimersByTime(1000);
        const event = await dismissed;

        expect(event.reason).toBe('timeout');
      } finally {
        vi.useRealTimers();
      }
    });

    it('emits mh-snackbar-dismissed with the programmatic reason', async () => {
      const el = await fixture<Snackbar>(html`<mh-snackbar></mh-snackbar>`);
      el.open('Saved');

      const dismissed = oneEvent(
        el,
        'mh-snackbar-dismissed',
      ) as Promise<SnackbarDismissedEvent>;
      el.dismiss();
      const event = await dismissed;

      expect(event.reason).toBe('programmatic');
    });
  });
});
