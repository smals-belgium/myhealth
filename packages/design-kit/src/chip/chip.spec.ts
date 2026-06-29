import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, part } from '../core/testing';

import '../icon';
import './chip';
import type { Chip, ChipVariant } from './chip';
import type { ChipRemoveEvent } from './chip-remove.event';
import type { ChipSelectionChangeEvent } from './chip-selection-change.event';

const variants: ChipVariant[] = [
  'brand',
  'success',
  'neutral',
  'warning',
  'danger',
  'tertiary',
];

describe('chip', () => {
  describe('accessibility', () => {
    it('passes accessibility tests for a status chip', async () => {
      await assertAccessibility(await fixture(html`<mh-chip>Active</mh-chip>`));
    });

    variants.forEach(variant => {
      it(`is accessible when a status chip has variant "${variant}"`, async () => {
        await assertAccessibility(
          await fixture<Chip>(
            html`<mh-chip variant=${variant}>Status</mh-chip>`,
          ),
        );
      });
    });

    it('is accessible for an unselected filter chip', async () => {
      await assertAccessibility(
        await fixture<Chip>(html`<mh-chip kind="filter">Filter</mh-chip>`),
      );
    });

    it('is accessible for a selected filter chip', async () => {
      await assertAccessibility(
        await fixture<Chip>(
          html`<mh-chip
            kind="filter"
            selected
            >Filter</mh-chip
          >`,
        ),
      );
    });

    it('is accessible for a disabled filter chip', async () => {
      await assertAccessibility(
        await fixture<Chip>(
          html`<mh-chip
            kind="filter"
            disabled
            >Filter</mh-chip
          >`,
        ),
      );
    });

    it('is accessible for an input chip', async () => {
      await assertAccessibility(
        await fixture<Chip>(html`<mh-chip kind="input">Tag</mh-chip>`),
      );
    });

    it('is accessible for a disabled input chip', async () => {
      await assertAccessibility(
        await fixture<Chip>(
          html`<mh-chip
            kind="input"
            disabled
            >Tag</mh-chip
          >`,
        ),
      );
    });
  });

  describe('kind', () => {
    it('has default kind "status"', async () => {
      const el = await fixture<Chip>(html`<mh-chip>Status</mh-chip>`);
      expect(el.kind).toBe('status');
      expect(el.getAttribute('kind')).toBe('status');
    });

    it('reflects kind to an attribute', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip kind="filter">Filter</mh-chip>`,
      );
      expect(el.kind).toBe('filter');
      expect(el.getAttribute('kind')).toBe('filter');
    });

    it('renders a span base for status chips', async () => {
      const el = await fixture<Chip>(html`<mh-chip>Status</mh-chip>`);
      expect(part('base', el)?.tagName).toBe('SPAN');
    });

    it('renders a button base for filter chips', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip kind="filter">Filter</mh-chip>`,
      );
      expect(part('base', el)?.tagName).toBe('BUTTON');
    });
  });

  describe('variant', () => {
    it('has default variant "neutral"', async () => {
      const el = await fixture<Chip>(html`<mh-chip>Status</mh-chip>`);
      expect(el.variant).toBe('neutral');
      expect(el.getAttribute('variant')).toBe('neutral');
    });

    it('reflects variant to an attribute', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip variant="danger">Status</mh-chip>`,
      );
      expect(el.variant).toBe('danger');
      expect(el.getAttribute('variant')).toBe('danger');
    });
  });

  describe('filter chips', () => {
    it('is not selected by default', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip kind="filter">Filter</mh-chip>`,
      );
      expect(el.selected).toBe(false);
      expect(el.hasAttribute('selected')).toBe(false);
    });

    it('reflects selected to a checkmark and the host attribute', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip
          kind="filter"
          selected
          >Filter</mh-chip
        >`,
      );
      expect(part('checkmark', el)).not.toBeNull();
      expect(el.hasAttribute('selected')).toBe(true);
    });

    it('sets aria-pressed on the button', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip
          kind="filter"
          selected
          >Filter</mh-chip
        >`,
      );
      expect(part('base', el)?.getAttribute('aria-pressed')).toBe('true');
    });

    it('toggles selection and emits mh-chip-selection-change on click', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip kind="filter">Filter</mh-chip>`,
      );

      const changed = oneEvent(
        el,
        'mh-chip-selection-change',
      ) as Promise<ChipSelectionChangeEvent>;
      part<HTMLButtonElement>('base', el)?.click();
      const event = await changed;

      expect(event.selected).toBe(true);
      expect(el.selected).toBe(true);
    });

    it('does not toggle when disabled', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip
          kind="filter"
          disabled
          >Filter</mh-chip
        >`,
      );
      const changeHandler = vi.fn();

      el.addEventListener('mh-chip-selection-change', changeHandler);
      part<HTMLButtonElement>('base', el)?.click();

      expect(changeHandler).not.toHaveBeenCalled();
      expect(el.selected).toBe(false);
    });
  });

  describe('input chips', () => {
    it('exposes an accessible remove label on the base', async () => {
      const el = await fixture<Chip>(html`<mh-chip kind="input">Tag</mh-chip>`);
      const base = part('base', el);
      expect(base).not.toBeNull();
      expect(base?.getAttribute('aria-label')).toBe('Remove Tag');
    });

    it('uses a custom remove label when provided', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip
          kind="input"
          remove-label="Remove tag"
          >Tag</mh-chip
        >`,
      );
      expect(part('base', el)?.getAttribute('aria-label')).toBe('Remove tag');
    });

    it('emits mh-chip-remove with the value when the chip is clicked', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip
          kind="input"
          value="alpha"
          >Tag</mh-chip
        >`,
      );

      const removed = oneEvent(
        el,
        'mh-chip-remove',
      ) as Promise<ChipRemoveEvent>;
      part<HTMLElement>('remove', el)?.click();
      const event = await removed;

      expect(event.value).toBe('alpha');
    });

    it('emits mh-chip-remove when pressing Backspace', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip
          kind="input"
          value="beta"
          >Tag</mh-chip
        >`,
      );

      const removed = oneEvent(
        el,
        'mh-chip-remove',
      ) as Promise<ChipRemoveEvent>;
      part('base', el)?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }),
      );
      const event = await removed;

      expect(event.value).toBe('beta');
    });

    it('does not emit mh-chip-remove when disabled', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip
          kind="input"
          disabled
          >Tag</mh-chip
        >`,
      );
      const removeHandler = vi.fn();

      el.addEventListener('mh-chip-remove', removeHandler);
      part('base', el)?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }),
      );

      expect(removeHandler).not.toHaveBeenCalled();
    });
  });

  describe('disabled', () => {
    it('is not disabled by default', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip kind="filter">Filter</mh-chip>`,
      );
      expect(el.disabled).toBe(false);
    });

    it('reflects disabled to an attribute', async () => {
      const el = await fixture<Chip>(
        html`<mh-chip
          kind="filter"
          disabled
          >Filter</mh-chip
        >`,
      );
      expect(el.disabled).toBe(true);
      expect(el.getAttribute('disabled')).toBe('');
    });
  });
});
