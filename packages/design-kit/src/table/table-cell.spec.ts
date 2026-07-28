import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, part } from '../core/testing';

import './table-cell';
import type { TableCell } from './table-cell';

describe('table-cell', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(
          html`<div role="table">
            <div role="row"><mh-table-cell>Cell</mh-table-cell></div>
          </div>`,
        ),
      );
    });
  });

  describe('role', () => {
    it('has role "cell"', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="row"><mh-table-cell>Cell</mh-table-cell></div>
        </div>`,
      );
      const el = wrapper.querySelector<TableCell>('mh-table-cell')!;
      expect(el.internals.role).toBe('cell');
    });
  });

  describe('rendering', () => {
    it('renders a slot', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="row"><mh-table-cell>Content</mh-table-cell></div>
        </div>`,
      );
      const el = wrapper.querySelector<TableCell>('mh-table-cell')!;
      expect(el.shadowRoot?.querySelector('slot')).not.toBeNull();
    });

    it('part helper returns null for non-existent parts', () => {
      const div = document.createElement('div');
      expect(part('nonexistent', div)).toBeNull();
    });
  });
});
