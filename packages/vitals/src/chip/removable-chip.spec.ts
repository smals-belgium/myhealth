import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, part } from '../core/testing';

import '../icon';
import './removable-chip';
import type { ChipRemoveEvent } from './chip-remove.event';
import type { RemovableChip } from './removable-chip';

describe('mh-removable-chip', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(html`<mh-removable-chip>Tag</mh-removable-chip>`),
      );
    });

    it('passes accessibility tests when disabled', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-removable-chip disabled>Tag</mh-removable-chip>`,
        ),
      );
    });
  });

  describe('base', () => {
    it('renders a span as the base', async () => {
      const el = await fixture<RemovableChip>(
        html`<mh-removable-chip>Tag</mh-removable-chip>`,
      );
      expect(part('base', el)?.tagName).toBe('SPAN');
    });

    it('renders a button as the remove control', async () => {
      const el = await fixture<RemovableChip>(
        html`<mh-removable-chip>Tag</mh-removable-chip>`,
      );
      expect(part('remove', el)?.tagName).toBe('BUTTON');
    });
  });

  describe('remove label', () => {
    it('sets a default accessible label combining "Remove" and the chip label', async () => {
      const el = await fixture<RemovableChip>(
        html`<mh-removable-chip>Tag</mh-removable-chip>`,
      );
      expect(part('remove', el)?.getAttribute('aria-label')).toBe('Remove Tag');
    });

    it('uses a custom remove label when provided', async () => {
      const el = await fixture<RemovableChip>(
        html`<mh-removable-chip remove-label="Remove tag"
          >Tag</mh-removable-chip
        >`,
      );
      expect(part('remove', el)?.getAttribute('aria-label')).toBe('Remove tag');
    });
  });

  describe('remove event', () => {
    it('emits mh-chip-remove with the value when clicked', async () => {
      const el = await fixture<RemovableChip>(
        html`<mh-removable-chip value="alpha">Tag</mh-removable-chip>`,
      );

      const removed = oneEvent(
        el,
        'mh-chip-remove',
      ) as Promise<ChipRemoveEvent>;
      part<HTMLButtonElement>('remove', el)?.click();
      const event = await removed;

      expect(event.value).toBe('alpha');
    });

    it('emits mh-chip-remove when pressing Backspace', async () => {
      const el = await fixture<RemovableChip>(
        html`<mh-removable-chip value="beta">Tag</mh-removable-chip>`,
      );

      const removed = oneEvent(
        el,
        'mh-chip-remove',
      ) as Promise<ChipRemoveEvent>;
      part('remove', el)?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }),
      );
      const event = await removed;

      expect(event.value).toBe('beta');
    });

    it('emits mh-chip-remove when pressing Delete', async () => {
      const el = await fixture<RemovableChip>(
        html`<mh-removable-chip value="gamma">Tag</mh-removable-chip>`,
      );

      const removed = oneEvent(
        el,
        'mh-chip-remove',
      ) as Promise<ChipRemoveEvent>;
      part('remove', el)?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }),
      );
      const event = await removed;

      expect(event.value).toBe('gamma');
    });

    it('does not emit mh-chip-remove when disabled', async () => {
      const el = await fixture<RemovableChip>(
        html`<mh-removable-chip disabled>Tag</mh-removable-chip>`,
      );
      const removeHandler = vi.fn();

      el.addEventListener('mh-chip-remove', removeHandler);
      part('remove', el)?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }),
      );

      expect(removeHandler).not.toHaveBeenCalled();
    });
  });

  describe('disabled', () => {
    it('is not disabled by default', async () => {
      const el = await fixture<RemovableChip>(
        html`<mh-removable-chip>Tag</mh-removable-chip>`,
      );
      expect(el.disabled).toBe(false);
    });

    it('reflects disabled to an attribute', async () => {
      const el = await fixture<RemovableChip>(
        html`<mh-removable-chip disabled>Tag</mh-removable-chip>`,
      );
      expect(el.disabled).toBe(true);
      expect(el.getAttribute('disabled')).toBe('');
    });
  });
});
