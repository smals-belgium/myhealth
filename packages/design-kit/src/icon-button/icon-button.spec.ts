import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { ErrorEvent } from '../core/event/error.event.js';
import { assertAccessibility, part } from '../core/testing/index.js';

import './icon-button';
import type { IconButton } from './icon-button.js';
import type {
  IconButtonAppearance,
  IconButtonLoudness,
} from './icon-button.js';

const appearances: IconButtonAppearance[] = ['round', 'square'];
const loudnesses: IconButtonLoudness[] = ['normal', 'loud'];

describe('icon-button', () => {
  const getButton = (el: Element) => el.shadowRoot?.querySelector('button');

  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-icon-button title="Close" name="x"></mh-icon-button>`,
        ),
      );
    });

    appearances.forEach((appearance) => {
      it(`is accessible when appearance is "${appearance}"`, async () => {
        await assertAccessibility(
          await fixture(
            html`<mh-icon-button
              title="Close"
              name="x"
              appearance="${appearance}"
            ></mh-icon-button>`,
          ),
        );
      });
    });

    loudnesses.forEach((loudness) => {
      it(`is accessible when loudness is "${loudness}"`, async () => {
        await assertAccessibility(
          await fixture(
            html`<mh-icon-button
              title="Close"
              name="x"
              loudness="${loudness}"
            ></mh-icon-button>`,
          ),
        );
      });
    });

    it('is accessible when disabled', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-icon-button
            title="Close"
            name="x"
            disabled
          ></mh-icon-button>`,
        ),
      );
    });

    it('sets aria-label to the label property when provided', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button
          title="Close"
          label="Close dialog"
          name="x"
        ></mh-icon-button>`,
      );
      expect(getButton(el)?.getAttribute('aria-label')).toBe('Close dialog');
    });

    it('falls back to title for aria-label when label is not provided', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="Close" name="x"></mh-icon-button>`,
      );
      expect(getButton(el)?.getAttribute('aria-label')).toBe('Close');
    });
  });

  describe('title', () => {
    it('has default empty title', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button name="x" label="x"></mh-icon-button>`,
      );
      expect(el.title).toBe('');
      expect(getButton(el)?.getAttribute('title')).toBe('');
    });

    it('reflects title as a button attribute', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="Close" name="x"></mh-icon-button>`,
      );
      expect(el.title).toBe('Close');
      expect(getButton(el)?.getAttribute('title')).toBe('Close');
    });
  });

  describe('label', () => {
    it('has no default label', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="x"></mh-icon-button>`,
      );
      expect(el.label).toBeUndefined();
    });
  });

  describe('name', () => {
    it('has no default name', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="Close"></mh-icon-button>`,
      );
      expect(el.name).toBeUndefined();
    });

    it('reflects name to an attribute', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="Close" name="x"></mh-icon-button>`,
      );
      expect(el.name).toBe('x');
      expect(el.getAttribute('name')).toBe('x');
    });

    it('passes name to the inner mh-icon', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="Close" name="x"></mh-icon-button>`,
      );
      expect(part('icon', el)?.getAttribute('name')).toBe('x');
    });
  });

  describe('appearance', () => {
    it('has default appearance "round"', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="Close" name="x"></mh-icon-button>`,
      );
      expect(el.appearance).toBe('round');
      expect(el.getAttribute('appearance')).toBe('round');
    });

    it('reflects appearance to an attribute', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button
          title="Close"
          name="x"
          appearance="square"
        ></mh-icon-button>`,
      );
      expect(el.appearance).toBe('square');
      expect(el.getAttribute('appearance')).toBe('square');
    });
  });

  describe('loudness', () => {
    it('has default loudness "normal"', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="Close" name="x"></mh-icon-button>`,
      );
      expect(el.loudness).toBe('normal');
      expect(el.getAttribute('loudness')).toBe('normal');
    });

    it('reflects loudness to an attribute', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button
          title="Close"
          name="x"
          loudness="loud"
        ></mh-icon-button>`,
      );
      expect(el.loudness).toBe('loud');
      expect(el.getAttribute('loudness')).toBe('loud');
    });
  });

  describe('disabled', () => {
    it('is not disabled by default', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="Close" name="x"></mh-icon-button>`,
      );
      expect(el.disabled).toBe(false);
      expect(el.getAttribute('disabled')).toBeNull();
    });

    it('reflects disabled as a boolean attribute', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="Close" name="x" disabled></mh-icon-button>`,
      );
      expect(el.disabled).toBe(true);
      expect(el.getAttribute('disabled')).toBe('');
    });

    it(`doesn't emit a click event when disabled`, async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="Close" name="x" disabled></mh-icon-button>`,
      );
      const clickHandler = vi.fn();

      el.addEventListener('click', clickHandler);
      el.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });
  });

  describe('validation', () => {
    it(`emits an mh-error event when initially rendered without title or label`, async () => {
      const el = document.createElement('mh-icon-button') as IconButton;
      const listener = oneEvent(el, 'mh-error');
      document.body.appendChild(el);
      expect((await listener) instanceof ErrorEvent).toBe(true);
    });
  });

  describe('events', () => {
    it('emits focus and blur when focused and blurred', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="Close" name="x"></mh-icon-button>`,
      );
      const focusHandler = vi.fn();
      const blurHandler = vi.fn();

      el.addEventListener('focus', focusHandler);
      el.addEventListener('blur', blurHandler);
      el.focus();
      el.blur();

      expect(focusHandler).toHaveBeenCalledTimes(1);
      expect(blurHandler).toHaveBeenCalledTimes(1);
    });

    it('emits a click event when calling click()', async () => {
      const el = await fixture<IconButton>(
        html`<mh-icon-button title="Close" name="x"></mh-icon-button>`,
      );
      const clickHandler = vi.fn();

      el.addEventListener('click', clickHandler);
      el.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);
    });
  });
});
