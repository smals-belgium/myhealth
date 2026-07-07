import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility } from '../core/testing';

import './table-cell';
import './table-row';
import type { RowExpandChangeEvent } from './row-expand-change.event';
import type { TableRow } from './table-row';

describe('table-row', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(
          html`<div role="table">
            <div role="rowgroup">
              <mh-table-row value="1"
                ><mh-table-cell>Cell</mh-table-cell></mh-table-row
              >
            </div>
          </div>`,
        ),
      );
    });
  });

  describe('expansion', () => {
    it('is not expanded by default', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              expandable
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(row.expanded).toBe(false);
    });

    it('toggles expanded on button click', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              expandable
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      const btn = row.shadowRoot!.querySelector<HTMLButtonElement>(
        '[part="expand-button"]',
      )!;
      btn.click();
      await row.updateComplete;
      expect(row.expanded).toBe(true);
    });

    it('collapses when expand button is clicked again', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              expandable
              expanded
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      const btn = row.shadowRoot!.querySelector<HTMLButtonElement>(
        '[part="expand-button"]',
      )!;
      btn.click();
      await row.updateComplete;
      expect(row.expanded).toBe(false);
    });

    it('emits mh-table-row-expand-change when expanded', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              expandable
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;

      let expandedValue = false;
      row.addEventListener('mh-table-row-expand-change', event => {
        expandedValue = (event as RowExpandChangeEvent).expanded;
      });

      const btn = row.shadowRoot!.querySelector<HTMLButtonElement>(
        '[part="expand-button"]',
      )!;
      btn.click();
      await row.updateComplete;
      expect(expandedValue).toBe(true);
    });

    it('renders expansion-row when expandable', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              expandable
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(
        row.shadowRoot?.querySelector('[part="expansion-row"]'),
      ).not.toBeNull();
    });

    it('does not render expansion-row when not expandable', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(
        row.shadowRoot?.querySelector('[part="expansion-row"]'),
      ).toBeNull();
    });
  });

  describe('selection', () => {
    it('shows checkbox when selectable', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              selectable
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(row.shadowRoot?.querySelector('mh-checkbox')).not.toBeNull();
    });

    it('does not show checkbox when not selectable', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(row.shadowRoot?.querySelector('mh-checkbox')).toBeNull();
    });

    it('reflects the selected property as an attribute', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              selectable
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      row.selected = true;
      await row.updateComplete;
      expect(row.hasAttribute('selected')).toBe(true);
    });
  });

  describe('rendering', () => {
    it('renders a main row part', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(row.shadowRoot?.querySelector('[part="row"]')).not.toBeNull();
    });

    it('does not render a control-cell when not selectable or expandable', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(row.shadowRoot?.querySelector('[part="control-cell"]')).toBeNull();
    });

    it('renders a control-cell when selectable', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              selectable
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(
        row.shadowRoot?.querySelector('[part="control-cell"]'),
      ).not.toBeNull();
    });

    it('renders a control-cell when expandable', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              expandable
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(
        row.shadowRoot?.querySelector('[part="control-cell"]'),
      ).not.toBeNull();
    });

    it('renders an empty control-cell when showControl is set (for column alignment)', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              show-control
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      const controlCell = row.shadowRoot?.querySelector(
        '[part="control-cell"]',
      );
      expect(controlCell).not.toBeNull();
      expect(controlCell?.querySelector('mh-checkbox')).toBeNull();
      expect(controlCell?.querySelector('mh-icon-button')).toBeNull();
    });
  });
});
