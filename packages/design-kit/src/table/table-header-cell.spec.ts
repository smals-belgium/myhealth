import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility } from '../core/testing';

import './table-header-cell';
import type { TableHeaderCell } from './table-header-cell';

describe('table-header-cell', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(
          html`<div role="table">
            <div role="row">
              <mh-table-header-cell>Header</mh-table-header-cell>
            </div>
          </div>`,
        ),
      );
    });
  });

  describe('role', () => {
    it('has role "columnheader"', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="row">
            <mh-table-header-cell>Header</mh-table-header-cell>
          </div>
        </div>`,
      );
      const el = wrapper.querySelector<TableHeaderCell>(
        'mh-table-header-cell',
      )!;
      expect(el.internals.role).toBe('columnheader');
    });
  });

  describe('rendering', () => {
    it('renders a slot', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="row">
            <mh-table-header-cell>Content</mh-table-header-cell>
          </div>
        </div>`,
      );
      const el = wrapper.querySelector<TableHeaderCell>(
        'mh-table-header-cell',
      )!;
      expect(el.shadowRoot?.querySelector('slot')).not.toBeNull();
    });
  });
});
