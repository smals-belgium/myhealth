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
    it('has role "cell" by default', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="row"><mh-table-cell>Cell</mh-table-cell></div>
        </div>`,
      );
      const el = wrapper.querySelector<TableCell>('mh-table-cell')!;
      expect(el.internals.role).toBe('cell');
    });

    it('has role "columnheader" when header attribute is set', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="row"><mh-table-cell header>Header</mh-table-cell></div>
        </div>`,
      );
      const el = wrapper.querySelector<TableCell>('mh-table-cell')!;
      expect(el.internals.role).toBe('columnheader');
    });

    it('updates role when header property changes', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="row"><mh-table-cell>Cell</mh-table-cell></div>
        </div>`,
      );
      const el = wrapper.querySelector<TableCell>('mh-table-cell')!;
      expect(el.internals.role).toBe('cell');

      el.header = true;
      await el.updateComplete;
      expect(el.internals.role).toBe('columnheader');
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

    it('reflects the header attribute', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="row"><mh-table-cell header>Header</mh-table-cell></div>
        </div>`,
      );
      const el = wrapper.querySelector<TableCell>('mh-table-cell')!;
      expect(el.hasAttribute('header')).toBe(true);
    });

    it('part helper returns null for non-existent parts', () => {
      const div = document.createElement('div');
      expect(part('nonexistent', div)).toBeNull();
    });
  });
});
