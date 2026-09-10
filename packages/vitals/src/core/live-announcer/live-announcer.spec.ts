import { LiveAnnouncer, liveAnnouncer } from './live-announcer';

describe('LiveAnnouncer', () => {
  afterEach(() => {
    // Remove any regions created during the test so the document body stays clean between cases.
    document
      .querySelectorAll('.mh-live-announcer')
      .forEach(region => region.remove());
  });

  describe('region creation', () => {
    it('creates a visually hidden live region in the document body on construction', () => {
      const announcer = new LiveAnnouncer();
      const { region } = announcer;

      expect(region).toBeDefined();
      expect(region?.parentElement).toBe(document.body);
    });

    it('sets the expected live region attributes', () => {
      const { region } = new LiveAnnouncer();

      expect(region?.getAttribute('aria-live')).toBe('polite');
      expect(region?.getAttribute('aria-atomic')).toBe('true');
      expect(region?.className).toBe('mh-live-announcer');
    });

    it('renders the region off-screen so it is not visible', () => {
      const { region } = new LiveAnnouncer();

      expect(region?.style.position).toBe('absolute');
      expect(region?.style.overflow).toBe('hidden');
      expect(region?.style.width).toBe('1px');
      expect(region?.style.height).toBe('1px');
    });
  });

  describe('announce', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('injects the message after the announce delay', () => {
      const announcer = new LiveAnnouncer();

      announcer.announce('Saved');
      // The region is cleared synchronously and the text injected later.
      expect(announcer.region?.textContent).toBe('');

      vi.advanceTimersByTime(100);
      expect(announcer.region?.textContent).toBe('Saved');
    });

    it('defaults to polite politeness', () => {
      const announcer = new LiveAnnouncer();

      announcer.announce('Saved');

      expect(announcer.region?.getAttribute('aria-live')).toBe('polite');
    });

    it('uses the requested politeness', () => {
      const announcer = new LiveAnnouncer();

      announcer.announce('Urgent', 'assertive');

      expect(announcer.region?.getAttribute('aria-live')).toBe('assertive');
    });

    it('clears the region before injecting so identical messages re-announce', () => {
      const announcer = new LiveAnnouncer();

      announcer.announce('Message archived');
      vi.advanceTimersByTime(100);
      expect(announcer.region?.textContent).toBe('Message archived');

      // Announcing the same message clears the region first, then re-injects the same text.
      announcer.announce('Message archived');
      expect(announcer.region?.textContent).toBe('');

      vi.advanceTimersByTime(100);
      expect(announcer.region?.textContent).toBe('Message archived');
    });

    it('cancels a pending announcement when a new one arrives', () => {
      const announcer = new LiveAnnouncer();

      announcer.announce('First');
      vi.advanceTimersByTime(50);
      announcer.announce('Second');

      // The first announcement's timer was cleared, so it never lands.
      vi.advanceTimersByTime(50);
      expect(announcer.region?.textContent).toBe('');

      vi.advanceTimersByTime(50);
      expect(announcer.region?.textContent).toBe('Second');
    });

    it('reuses a single region across multiple announcements', () => {
      const announcer = new LiveAnnouncer();
      const firstRegion = announcer.region;

      announcer.announce('One');
      vi.advanceTimersByTime(100);
      announcer.announce('Two');
      vi.advanceTimersByTime(100);

      expect(announcer.region).toBe(firstRegion);
      expect(document.querySelectorAll('.mh-live-announcer')).toHaveLength(1);
    });

    it('recreates the region if it was removed from the DOM', () => {
      const announcer = new LiveAnnouncer();

      announcer.region?.remove();
      announcer.announce('Recovered');
      vi.advanceTimersByTime(100);

      expect(announcer.region?.isConnected).toBe(true);
      expect(announcer.region?.parentElement).toBe(document.body);
      expect(announcer.region?.textContent).toBe('Recovered');
    });
  });

  describe('shared instance', () => {
    it('exposes a singleton live announcer', () => {
      expect(liveAnnouncer).toBeInstanceOf(LiveAnnouncer);
    });
  });
});
