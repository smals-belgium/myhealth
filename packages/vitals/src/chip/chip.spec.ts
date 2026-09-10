import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, part } from '../core/testing';

import '../icon';
import './chip';
import type { Chip, ChipVariant } from './chip';

const variants: ChipVariant[] = [
  'brand',
  'success',
  'neutral',
  'warning',
  'danger',
  'tertiary',
];

describe('mh-chip', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(await fixture(html`<mh-chip>Active</mh-chip>`));
    });

    variants.forEach(variant => {
      it(`is accessible with variant "${variant}"`, async () => {
        await assertAccessibility(
          await fixture<Chip>(
            html`<mh-chip variant=${variant}>Status</mh-chip>`,
          ),
        );
      });
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

  describe('base', () => {
    it('renders a span as the base', async () => {
      const el = await fixture<Chip>(html`<mh-chip>Status</mh-chip>`);
      expect(part('base', el)?.tagName).toBe('SPAN');
    });
  });
});
