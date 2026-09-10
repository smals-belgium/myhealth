import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, defaultSlot, slot } from '../../core/testing';

import './option';
import type { Option } from './option';

describe('option', () => {
  describe('accessibility', () => {
    // `role="option"` requires a `listbox` or `group` parent, so options are
    // wrapped accordingly for these assertions.
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(
          html`<div
            role="listbox"
            aria-label="Options"
          >
            <mh-option value="a">Option A</mh-option>
          </div>`,
        ),
      );
    });

    it('is accessible when disabled', async () => {
      await assertAccessibility(
        await fixture(
          html`<div
            role="listbox"
            aria-label="Options"
          >
            <mh-option
              value="b"
              disabled
              >Option B</mh-option
            >
          </div>`,
        ),
      );
    });

    it('is accessible when selected', async () => {
      await assertAccessibility(
        await fixture(
          html`<div
            role="listbox"
            aria-label="Options"
          >
            <mh-option
              value="c"
              selected
              >Option C</mh-option
            >
          </div>`,
        ),
      );
    });
  });

  describe('role', () => {
    it('sets role to "option" on the host', async () => {
      const el = await fixture<Option>(
        html`<mh-option value="d">Option D</mh-option>`,
      );
      expect(el.getAttribute('role')).toBe('option');
    });
  });

  describe('value', () => {
    it('defaults to an empty string', async () => {
      const el = await fixture<Option>(html`<mh-option></mh-option>`);
      expect(el.value).toBe('');
    });

    it('reflects value to the host attribute', async () => {
      const el = await fixture<Option>(
        html`<mh-option value="e">Option E</mh-option>`,
      );
      expect(el.value).toBe('e');
      expect(el.getAttribute('value')).toBe('e');
    });

    it('updates the value host attribute when the property changes', async () => {
      const el = await fixture<Option>(
        html`<mh-option value="f">Option F</mh-option>`,
      );
      el.value = 'g';
      await el.updateComplete;

      expect(el.getAttribute('value')).toBe('g');
    });
  });

  describe('disabled', () => {
    it('is not disabled by default', async () => {
      const el = await fixture<Option>(
        html`<mh-option value="h">Option H</mh-option>`,
      );
      expect(el.disabled).toBe(false);
    });

    it('is disabled when the attribute is present', async () => {
      const el = await fixture<Option>(
        html`<mh-option
          value="i"
          disabled
          >Option I</mh-option
        >`,
      );
      expect(el.disabled).toBe(true);
    });

    it('supports toggling disabled programmatically', async () => {
      const el = await fixture<Option>(
        html`<mh-option value="j">Option J</mh-option>`,
      );
      el.disabled = true;
      await el.updateComplete;

      expect(el.disabled).toBe(true);
    });
  });

  describe('selected', () => {
    it('is not selected by default', async () => {
      const el = await fixture<Option>(
        html`<mh-option value="k">Option K</mh-option>`,
      );
      expect(el.selected).toBe(false);
    });

    it('is selected when the attribute is present', async () => {
      const el = await fixture<Option>(
        html`<mh-option
          value="l"
          selected
          >Option L</mh-option
        >`,
      );
      expect(el.selected).toBe(true);
    });

    it('supports toggling selected programmatically', async () => {
      const el = await fixture<Option>(
        html`<mh-option value="m">Option M</mh-option>`,
      );
      el.selected = true;
      await el.updateComplete;

      expect(el.selected).toBe(true);

      el.selected = false;
      await el.updateComplete;

      expect(el.selected).toBe(false);
    });
  });

  describe('slots', () => {
    it('renders default slot content in the label part', async () => {
      const el = await fixture<Option>(
        html`<mh-option value="n">Option N</mh-option>`,
      );
      expect(defaultSlot(el)?.assignedNodes().length).toBeGreaterThan(0);
    });

    it('renders the start slot content', async () => {
      const el = await fixture<Option>(
        html`<mh-option value="o">
          <span slot="start">icon</span>
          Option O
        </mh-option>`,
      );
      expect(slot('start', el)?.assignedNodes().length).toBe(1);
    });

    it('renders the end slot content', async () => {
      const el = await fixture<Option>(
        html`<mh-option value="p">
          Option P
          <span slot="end">badge</span>
        </mh-option>`,
      );
      expect(slot('end', el)?.assignedNodes().length).toBe(1);
    });
  });
});
