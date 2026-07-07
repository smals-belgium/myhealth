import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility } from '../core/testing';

import './table';
import './table-cell';
import './table-row';
import type { SelectionChangeEvent } from './selection-change.event';
import type { Table } from './table';
import type { TableRow } from './table-row';

describe('table', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(html`
          <mh-table>
            <mh-table-cell slot="header">Name</mh-table-cell>
            <mh-table-row value="1"
              ><mh-table-cell>Alice</mh-table-cell></mh-table-row
            >
          </mh-table>
        `),
      );
    });
  });

  describe('selectable', () => {
    it('propagates selectable to child rows', async () => {
      const el = await fixture<Table>(html`
        <mh-table selectable>
          <mh-table-cell slot="header">Name</mh-table-cell>
          <mh-table-row value="1"
            ><mh-table-cell>Alice</mh-table-cell></mh-table-row
          >
        </mh-table>
      `);
      await el.updateComplete;
      const row = el.querySelector<TableRow>('mh-table-row')!;
      expect(row.selectable).toBe(true);
    });

    it('propagates selectable=false when attribute is removed', async () => {
      const el = await fixture<Table>(html`
        <mh-table selectable>
          <mh-table-cell slot="header">Name</mh-table-cell>
          <mh-table-row value="1"
            ><mh-table-cell>Alice</mh-table-cell></mh-table-row
          >
        </mh-table>
      `);
      await el.updateComplete;
      el.selectable = false;
      await el.updateComplete;
      const row = el.querySelector<TableRow>('mh-table-row')!;
      expect(row.selectable).toBe(false);
    });

    it('emits mh-table-selection-change when a row dispatches change', async () => {
      const el = await fixture<Table>(html`
        <mh-table selectable>
          <mh-table-cell slot="header">Name</mh-table-cell>
          <mh-table-row value="row-1"
            ><mh-table-cell>Alice</mh-table-cell></mh-table-row
          >
        </mh-table>
      `);
      await el.updateComplete;

      let eventFired = false;
      let selectedValues: string[] = [];
      el.addEventListener('mh-table-selection-change', event => {
        eventFired = true;
        selectedValues = (event as SelectionChangeEvent).selected;
      });

      const row = el.querySelector<TableRow>('mh-table-row')!;
      row.selected = true;
      row.dispatchEvent(new Event('change', { bubbles: true }));

      expect(eventFired).toBe(true);
      expect(selectedValues).toContain('row-1');
    });
  });

  describe('selected getter', () => {
    it('returns values of selected rows', async () => {
      const el = await fixture<Table>(html`
        <mh-table selectable>
          <mh-table-cell slot="header">Name</mh-table-cell>
          <mh-table-row
            value="a"
            selected
            ><mh-table-cell>Alice</mh-table-cell></mh-table-row
          >
          <mh-table-row value="b"
            ><mh-table-cell>Bob</mh-table-cell></mh-table-row
          >
        </mh-table>
      `);
      await el.updateComplete;
      expect(el.selected).toEqual(['a']);
    });

    it('excludes rows with empty value', async () => {
      const el = await fixture<Table>(html`
        <mh-table selectable>
          <mh-table-cell slot="header">Name</mh-table-cell>
          <mh-table-row selected
            ><mh-table-cell>No value</mh-table-cell></mh-table-row
          >
        </mh-table>
      `);
      await el.updateComplete;
      expect(el.selected).toEqual([]);
    });
  });

  describe('caption', () => {
    it('sets aria-label via internals when caption is provided', async () => {
      const el = await fixture<Table>(html`
        <mh-table caption="Patient list">
          <mh-table-cell slot="header">Name</mh-table-cell>
          <mh-table-row value="1"
            ><mh-table-cell>Alice</mh-table-cell></mh-table-row
          >
        </mh-table>
      `);
      await el.updateComplete;
      expect(el.internals.ariaLabel).toBe('Patient list');
    });
  });

  describe('rendering', () => {
    it('renders head and body parts', async () => {
      const el = await fixture<Table>(html`
        <mh-table>
          <mh-table-cell slot="header">Name</mh-table-cell>
          <mh-table-row value="1"
            ><mh-table-cell>Alice</mh-table-cell></mh-table-row
          >
        </mh-table>
      `);
      expect(el.shadowRoot?.querySelector('[part="head"]')).not.toBeNull();
      expect(el.shadowRoot?.querySelector('[part="body"]')).not.toBeNull();
    });

    it('renders select-all checkbox when selectable', async () => {
      const el = await fixture<Table>(html`
        <mh-table selectable>
          <mh-table-cell slot="header">Name</mh-table-cell>
          <mh-table-row value="1"
            ><mh-table-cell>Alice</mh-table-cell></mh-table-row
          >
        </mh-table>
      `);
      expect(
        el.shadowRoot?.querySelector('[part="select-all"]'),
      ).not.toBeNull();
    });

    it('does not render select-all checkbox when not selectable', async () => {
      const el = await fixture<Table>(html`
        <mh-table>
          <mh-table-cell slot="header">Name</mh-table-cell>
          <mh-table-row value="1"
            ><mh-table-cell>Alice</mh-table-cell></mh-table-row
          >
        </mh-table>
      `);
      expect(el.shadowRoot?.querySelector('[part="select-all"]')).toBeNull();
    });
  });
});
