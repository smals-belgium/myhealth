import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, part } from '../core/testing';

import './tooltip';
import type { Tooltip } from './tooltip';

describe('tooltip', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      await assertAccessibility(el);
    });
  });

  describe('defaults', () => {
    it('is closed by default', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      expect(el.open).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('defaults to top placement', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      expect(el.placement).toBe('top');
      expect(el.getAttribute('placement')).toBe('top');
    });

    it('has show-delay default of 0', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      expect(el.showDelay).toBe(0);
    });

    it('has hide-delay default of 0', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      expect(el.hideDelay).toBe(0);
    });
  });

  describe('interaction', () => {
    it('opens on focusin and closes on focusout', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      el.dispatchEvent(
        new FocusEvent('focusin', { bubbles: true, composed: true }),
      );
      expect(el.open).toBe(true);

      el.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, composed: true }),
      );
      expect(el.open).toBe(false);
    });

    it('opens on pointerenter and closes on pointerleave', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      // Pointerenter does not bubble — dispatch directly on the host
      el.dispatchEvent(new PointerEvent('pointerenter'));
      expect(el.open).toBe(true);

      el.dispatchEvent(new PointerEvent('pointerleave'));
      expect(el.open).toBe(false);
    });

    it('closes on Escape when open', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip
          content="More info"
          open
        >
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      el.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      expect(el.open).toBe(false);
    });

    it('does not open when disabled', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip
          content="More info"
          disabled
        >
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      el.dispatchEvent(new PointerEvent('pointerenter'));
      expect(el.open).toBe(false);
    });

    it('closes when disabled is set to true while open', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);
      el.open = true;
      el.disabled = true;
      await el.updateComplete;

      expect(el.open).toBe(false);
    });

    it('does not open when there is no content', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip>
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      el.dispatchEvent(new PointerEvent('pointerenter'));
      expect(el.open).toBe(false);
    });
  });

  describe('programmatic control', () => {
    it('show() opens the tooltip', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      el.show();
      expect(el.open).toBe(true);
    });

    it('hide() closes the tooltip', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip
          content="More info"
          open
        >
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      el.hide();
      expect(el.open).toBe(false);
    });

    it('toggle() opens when closed', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      el.toggle();
      expect(el.open).toBe(true);
    });

    it('toggle() closes when open', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip
          content="More info"
          open
        >
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      el.toggle();
      expect(el.open).toBe(false);
    });

    it('isOpen getter mirrors the open property', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      expect(el.isOpen).toBe(false);
      el.show();
      expect(el.isOpen).toBe(true);
    });

    it('show() does nothing when disabled', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip
          content="More info"
          disabled
        >
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      el.show();
      expect(el.open).toBe(false);
    });
  });

  describe('delay', () => {
    it('delays opening by showDelay', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Tooltip>(html`
          <mh-tooltip
            content="More info"
            show-delay="300"
          >
            <button type="button">Info</button>
          </mh-tooltip>
        `);

        el.show();
        expect(el.open).toBe(false);

        vi.advanceTimersByTime(299);
        expect(el.open).toBe(false);

        vi.advanceTimersByTime(1);
        expect(el.open).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });

    it('delays hiding by hideDelay', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Tooltip>(html`
          <mh-tooltip
            content="More info"
            hide-delay="200"
            open
          >
            <button type="button">Info</button>
          </mh-tooltip>
        `);

        el.hide();
        expect(el.open).toBe(true);

        vi.advanceTimersByTime(199);
        expect(el.open).toBe(true);

        vi.advanceTimersByTime(1);
        expect(el.open).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });

    it('cancels pending show when hide is called before the delay expires', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Tooltip>(html`
          <mh-tooltip
            content="More info"
            show-delay="300"
          >
            <button type="button">Info</button>
          </mh-tooltip>
        `);

        el.show();
        el.hide();
        vi.advanceTimersByTime(500);

        expect(el.open).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });

    it('cancels pending hide when show is called before the delay expires', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Tooltip>(html`
          <mh-tooltip
            content="More info"
            hide-delay="300"
            open
          >
            <button type="button">Info</button>
          </mh-tooltip>
        `);

        el.hide();
        el.show();
        vi.advanceTimersByTime(500);

        expect(el.open).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });

    it('show(delay) overrides the showDelay property', async () => {
      vi.useFakeTimers();
      try {
        const el = await fixture<Tooltip>(html`
          <mh-tooltip
            content="More info"
            show-delay="1000"
          >
            <button type="button">Info</button>
          </mh-tooltip>
        `);

        el.show(100);
        vi.advanceTimersByTime(100);

        expect(el.open).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('placement', () => {
    const placements = [
      'top',
      'bottom',
      'left',
      'right',
      'start',
      'end',
    ] as const;

    placements.forEach(placement => {
      it(`reflects "${placement}" to the placement attribute`, async () => {
        const el = await fixture<Tooltip>(
          html`<mh-tooltip
            content="More info"
            placement=${placement}
            ><button type="button">Info</button></mh-tooltip
          >`,
        );

        expect(el.placement).toBe(placement);
        expect(el.getAttribute('placement')).toBe(placement);
      });
    });
  });

  describe('a11y wiring', () => {
    it('wires aria-describedby on the trigger to the tooltip id', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);
      await el.updateComplete;

      const trigger = el.querySelector('button');
      const tooltipSurface = part<HTMLElement>('tooltip', el);

      expect(trigger).not.toBeNull();
      expect(tooltipSurface).not.toBeNull();
      expect(trigger?.getAttribute('aria-describedby')).toContain(
        tooltipSurface?.id,
      );
    });

    it('removes aria-describedby from the trigger when disconnected', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);
      await el.updateComplete;

      const trigger = el.querySelector('button');
      expect(trigger?.hasAttribute('aria-describedby')).toBe(true);

      el.remove();

      expect(trigger?.hasAttribute('aria-describedby')).toBe(false);
    });

    it('preserves existing aria-describedby values when adding and removing', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button
            type="button"
            aria-describedby="existing-hint"
          >
            Info
          </button>
        </mh-tooltip>
      `);
      await el.updateComplete;

      const trigger = el.querySelector('button');
      const describedBy = trigger?.getAttribute('aria-describedby') ?? '';

      // Both the existing id and the tooltip id are present
      expect(describedBy).toContain('existing-hint');
      expect(describedBy).toContain(part<HTMLElement>('tooltip', el)?.id);

      el.remove();

      // Only the original id remains after disconnect
      expect(trigger?.getAttribute('aria-describedby')).toBe('existing-hint');
    });
  });
  describe('events', () => {
    it('dispatches change when open state changes', async () => {
      const el = await fixture<Tooltip>(html`
        <mh-tooltip content="More info">
          <button type="button">Info</button>
        </mh-tooltip>
      `);

      const handler = vi.fn();
      el.addEventListener('change', handler);

      el.show();
      await el.updateComplete;

      expect(handler).toHaveBeenCalledTimes(1);

      el.hide();
      await el.updateComplete;

      expect(handler).toHaveBeenCalledTimes(2);
    });
  });
});
