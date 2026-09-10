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
    it('is expandable when the expansion slot has content', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row value="1">
              <mh-table-cell>Cell</mh-table-cell>
              <div slot="expansion">Details</div>
            </mh-table-row>
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(row.expandable).toBe(true);
      expect(row.hasAttribute('expandable')).toBe(true);
    });

    it('is not expandable when the expansion slot is empty', async () => {
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
      expect(row.expandable).toBe(false);
      expect(row.hasAttribute('expandable')).toBe(false);
    });

    it('is not expanded by default', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row value="1">
              <mh-table-cell>Cell</mh-table-cell>
              <div slot="expansion">Details</div>
            </mh-table-row>
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
            <mh-table-row value="1">
              <mh-table-cell>Cell</mh-table-cell>
              <div slot="expansion">Details</div>
            </mh-table-row>
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
              expanded
              value="1"
            >
              <mh-table-cell>Cell</mh-table-cell>
              <div slot="expansion">Details</div>
            </mh-table-row>
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
            <mh-table-row value="1">
              <mh-table-cell>Cell</mh-table-cell>
              <div slot="expansion">Details</div>
            </mh-table-row>
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

    it('shows the expansion-row when expanded and expandable', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              expanded
              value="1"
            >
              <mh-table-cell>Cell</mh-table-cell>
              <div slot="expansion">Details</div>
            </mh-table-row>
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(
        row.shadowRoot
          ?.querySelector('[part="expansion-row"]')
          ?.hasAttribute('hidden'),
      ).toBe(false);
    });

    it('keeps the expansion-row hidden when not expanded', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row value="1">
              <mh-table-cell>Cell</mh-table-cell>
              <div slot="expansion">Details</div>
            </mh-table-row>
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(
        row.shadowRoot
          ?.querySelector('[part="expansion-row"]')
          ?.hasAttribute('hidden'),
      ).toBe(true);
    });

    it('keeps the expansion-row hidden when there is no expansion content, even if expanded', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              expanded
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(
        row.shadowRoot
          ?.querySelector('[part="expansion-row"]')
          ?.hasAttribute('hidden'),
      ).toBe(true);
    });
  });

  describe('selection', () => {
    it('shows checkbox in multi selection mode', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              selection-mode="multi"
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(row.shadowRoot?.querySelector('mh-checkbox')).not.toBeNull();
    });

    it('shows radio in single selection mode', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              selection-mode="single"
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      expect(row.shadowRoot?.querySelector('mh-radio')).not.toBeNull();
      expect(row.shadowRoot?.querySelector('mh-checkbox')).toBeNull();
    });

    it('does not show checkbox or radio when selectionMode is none', async () => {
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
      expect(row.shadowRoot?.querySelector('mh-radio')).toBeNull();
    });

    it('reflects the selected property as an attribute', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              selection-mode="multi"
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

    it('selects the row on click in single selection mode, but does not toggle it off', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              selection-mode="single"
              value="1"
              ><mh-table-cell>Cell</mh-table-cell></mh-table-row
            >
          </div>
        </div>`,
      );
      const row = wrapper.querySelector<TableRow>('mh-table-row')!;
      const rowPart = row.shadowRoot!.querySelector('[part="row"]')!;

      rowPart.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await row.updateComplete;
      expect(row.selected).toBe(true);

      rowPart.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await row.updateComplete;
      expect(row.selected).toBe(true);
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

    it('renders a control-cell when selectionMode is multi', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              selection-mode="multi"
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

    it('renders a control-cell when selectionMode is single', async () => {
      const wrapper = await fixture(
        html`<div role="table">
          <div role="rowgroup">
            <mh-table-row
              selection-mode="single"
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
            <mh-table-row value="1">
              <mh-table-cell>Cell</mh-table-cell>
              <div slot="expansion">Details</div>
            </mh-table-row>
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
