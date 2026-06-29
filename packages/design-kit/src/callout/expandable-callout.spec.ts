import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, part, slot } from '../core/testing';

import type { CalloutAfterClosedEvent } from './callout-after-closed.event.js';
import type { CalloutExpandedChangedEvent } from './callout-expanded-changed.event.js';
import './expandable-callout';
import type { ExpandableCallout } from './expandable-callout.js';

describe('expandable-callout', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      const el = await fixture<ExpandableCallout>(html`
        <mh-expandable-callout expanded>
          <span slot="title">Title</span>
          <span slot="description">Description</span>
        </mh-expandable-callout>
      `);
      el.open();

      await assertAccessibility(el);
    });
  });

  describe('slots', () => {
    it('renders the title, description and actions slots', async () => {
      const el = await fixture<ExpandableCallout>(html`
        <mh-expandable-callout expanded>
          <span slot="title">Title</span>
          <span slot="description">Description</span>
          <span slot="actions">Actions</span>
        </mh-expandable-callout>
      `);

      expect(slot('title', el)?.assignedNodes().length).toBe(1);
      expect(slot('description', el)?.assignedNodes().length).toBe(1);
      expect(slot('actions', el)?.assignedNodes().length).toBe(1);
    });
  });

  describe('variant', () => {
    it('shows the icon mapped to the variant', async () => {
      const el = await fixture<ExpandableCallout>(
        html`<mh-expandable-callout variant="error"></mh-expandable-callout>`,
      );

      expect(part('icon', el)?.getAttribute('name')).toBe('emergency_home');
    });
  });

  describe('expand / collapse', () => {
    it('renders a chevron toggle and no close button', async () => {
      const el = await fixture<ExpandableCallout>(html`
        <mh-expandable-callout>
          <span slot="title">Title</span>
        </mh-expandable-callout>
      `);

      expect(part('toggle', el)).not.toBeNull();
      expect(part('close', el)).toBeNull();
    });

    it('uses a native details element', async () => {
      const el = await fixture<ExpandableCallout>(html`
        <mh-expandable-callout expanded>
          <span slot="title">Title</span>
        </mh-expandable-callout>
      `);

      const details =
        el.shadowRoot?.querySelector<HTMLDetailsElement>('details');
      expect(details).not.toBeNull();
      expect(details?.open).toBe(true);
    });

    it('toggles expanded when the summary is activated and emits an event', async () => {
      const el = await fixture<ExpandableCallout>(html`
        <mh-expandable-callout>
          <span slot="title">Title</span>
        </mh-expandable-callout>
      `);

      setTimeout(() =>
        part('header', el)?.dispatchEvent(new MouseEvent('click')),
      );
      const event = (await oneEvent(
        el,
        'mh-callout-expanded-changed',
      )) as CalloutExpandedChangedEvent;

      expect(event.expanded).toBe(true);
      expect(el.expanded).toBe(true);
    });
  });

  describe('callout-close attribute', () => {
    it('closes with the attribute value when an action is activated', async () => {
      const el = await fixture<ExpandableCallout>(html`
        <mh-expandable-callout expanded>
          <span slot="title">Title</span>
          <button
            slot="actions"
            callout-close="ok"
          >
            OK
          </button>
        </mh-expandable-callout>
      `);
      el.open();

      const button = el.querySelector('button');
      setTimeout(() => button?.click());
      const event = (await oneEvent(
        el,
        'mh-callout-after-closed',
      )) as CalloutAfterClosedEvent;

      expect(event.result).toBe('ok');
      expect(el.isOpen).toBe(false);
    });
  });

  describe('accessibility: ARIA roles and live regions', () => {
    it('sets role="alert" and aria-live="assertive" for error variant', async () => {
      const el = await fixture<ExpandableCallout>(
        html`<mh-expandable-callout
          variant="error"
          expanded
        ></mh-expandable-callout>`,
      );
      el.open();

      const region = part('region', el);
      expect(region?.getAttribute('role')).toBe('alert');
      expect(region?.getAttribute('aria-live')).toBe('assertive');
    });

    it('sets role="status" and aria-live="polite" for info variant', async () => {
      const el = await fixture<ExpandableCallout>(
        html`<mh-expandable-callout
          variant="info"
          expanded
        ></mh-expandable-callout>`,
      );
      el.open();

      const region = part('region', el);
      expect(region?.getAttribute('role')).toBe('status');
      expect(region?.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('accessibility: focus restoration', () => {
    it('restores focus to the triggering element on close', async () => {
      const button = document.createElement('button');
      button.textContent = 'Open callout';
      document.body.appendChild(button);

      const el = await fixture<ExpandableCallout>(
        html`<mh-expandable-callout expanded></mh-expandable-callout>`,
      );

      button.focus();
      expect(document.activeElement).toBe(button);

      el.open();
      el.close();

      // Focus should return to the button
      expect(document.activeElement).toBe(button);

      document.body.removeChild(button);
    });
  });
});
