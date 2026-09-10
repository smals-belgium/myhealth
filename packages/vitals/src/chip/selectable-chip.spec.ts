import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import {
  assertAccessibility,
  part,
  polyfillAttachInternals,
} from '../core/testing';

import './selectable-chip';
import type { SelectableChip } from './selectable-chip';

beforeAll(polyfillAttachInternals);

describe('mh-selectable-chip', () => {
  describe('accessibility', () => {
    it('passes accessibility tests when unselected', async () => {
      await assertAccessibility(
        await fixture(html`<mh-selectable-chip>Filter</mh-selectable-chip>`),
      );
    });

    it('passes accessibility tests when selected', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-selectable-chip selected>Filter</mh-selectable-chip>`,
        ),
      );
    });

    it('passes accessibility tests when disabled', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-selectable-chip disabled>Filter</mh-selectable-chip>`,
        ),
      );
    });
  });

  describe('base', () => {
    it('renders a label as the base', async () => {
      const el = await fixture<SelectableChip>(
        html`<mh-selectable-chip>Filter</mh-selectable-chip>`,
      );
      expect(part('base', el)?.tagName).toBe('LABEL');
    });

    it('renders a checkbox input inside the label', async () => {
      const el = await fixture<SelectableChip>(
        html`<mh-selectable-chip>Filter</mh-selectable-chip>`,
      );
      expect(part<HTMLInputElement>('input', el)?.type).toBe('checkbox');
    });
  });

  describe('selected', () => {
    it('is not selected by default', async () => {
      const el = await fixture<SelectableChip>(
        html`<mh-selectable-chip>Filter</mh-selectable-chip>`,
      );
      expect(el.selected).toBe(false);
      expect(el.hasAttribute('selected')).toBe(false);
    });

    it('reflects selected to the host attribute', async () => {
      const el = await fixture<SelectableChip>(
        html`<mh-selectable-chip selected>Filter</mh-selectable-chip>`,
      );
      expect(el.selected).toBe(true);
      expect(el.hasAttribute('selected')).toBe(true);
    });

    it('sets the input as checked when selected', async () => {
      const el = await fixture<SelectableChip>(
        html`<mh-selectable-chip selected>Filter</mh-selectable-chip>`,
      );
      expect(part<HTMLInputElement>('input', el)?.checked).toBe(true);
    });

    it('sets the input as unchecked when not selected', async () => {
      const el = await fixture<SelectableChip>(
        html`<mh-selectable-chip>Filter</mh-selectable-chip>`,
      );
      expect(part<HTMLInputElement>('input', el)?.checked).toBe(false);
    });

    it('toggles selection and emits change event on click', async () => {
      const el = await fixture<SelectableChip>(
        html`<mh-selectable-chip value="alpha">Filter</mh-selectable-chip>`,
      );

      const changed = oneEvent(el, 'change') as Promise<Event>;
      part<HTMLLabelElement>('base', el)?.click();
      await changed;

      expect(el.selected).toBe(true);
    });

    it('does not toggle when disabled', async () => {
      const el = await fixture<SelectableChip>(
        html`<mh-selectable-chip disabled>Filter</mh-selectable-chip>`,
      );
      const changeHandler = vi.fn();

      el.addEventListener('change', changeHandler);
      part<HTMLLabelElement>('base', el)?.click();

      expect(changeHandler).not.toHaveBeenCalled();
      expect(el.selected).toBe(false);
    });
  });

  describe('disabled', () => {
    it('is not disabled by default', async () => {
      const el = await fixture<SelectableChip>(
        html`<mh-selectable-chip>Filter</mh-selectable-chip>`,
      );
      expect(el.disabled).toBe(false);
    });

    it('reflects disabled to an attribute', async () => {
      const el = await fixture<SelectableChip>(
        html`<mh-selectable-chip disabled>Filter</mh-selectable-chip>`,
      );
      expect(el.disabled).toBe(true);
      expect(el.getAttribute('disabled')).toBe('');
    });
  });
});
