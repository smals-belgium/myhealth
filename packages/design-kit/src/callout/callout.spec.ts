import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, part, slot } from '../core/testing';

import './callout';
import type { CalloutAfterClosedEvent } from './callout-after-closed.event.js';
import type { CalloutExpandedChangedEvent } from './callout-expanded-changed.event.js';
import type { Callout } from './callout.js';

describe('callout', () => {
  describe('accessibility', () => {
    it('passes accessibility tests in normal mode', async () => {
      const el = await fixture<Callout>(html`
        <mh-callout>
          <span slot="title">Title</span>
          <span slot="description">Description</span>
          <button
            slot="actions"
            callout-close
          >
            Dismiss
          </button>
        </mh-callout>
      `);
      el.open();

      await assertAccessibility(el);
    });

    it('passes accessibility tests in expansion mode', async () => {
      const el = await fixture<Callout>(html`
        <mh-callout mode="expansion">
          <span slot="title">Title</span>
          <span slot="description">Description</span>
        </mh-callout>
      `);
      el.open();

      await assertAccessibility(el);
    });
  });

  describe('slots', () => {
    it('renders the title, description and actions slots', async () => {
      const el = await fixture<Callout>(html`
        <mh-callout>
          <span slot="title">Title</span>
          <span slot="description">Description</span>
          <span slot="actions">Actions</span>
        </mh-callout>
      `);

      expect(slot('title', el)?.assignedNodes().length).toBe(1);
      expect(slot('description', el)?.assignedNodes().length).toBe(1);
      expect(slot('actions', el)?.assignedNodes().length).toBe(1);
    });
  });

  describe('variant', () => {
    it('defaults to the "info" variant', async () => {
      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);

      expect(el.variant).toBe('info');
      expect(el.getAttribute('variant')).toBe('info');
    });

    it('shows the icon mapped to the variant', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout variant="error"></mh-callout>`,
      );

      expect(part('icon', el)?.getAttribute('name')).toBe('emergency_home');
    });
  });

  describe('appearance', () => {
    it('defaults to the "color" appearance', async () => {
      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);

      expect(el.appearance).toBe('color');
      expect(el.getAttribute('appearance')).toBe('color');
    });

    it('reflects the "white" appearance to an attribute', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout appearance="white"></mh-callout>`,
      );

      expect(el.getAttribute('appearance')).toBe('white');
    });
  });

  describe('open / close', () => {
    it('is closed by default', async () => {
      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);

      expect(el.isOpen).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('opens and reflects the open attribute', async () => {
      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);

      el.open();

      expect(el.isOpen).toBe(true);
      expect(el.hasAttribute('open')).toBe(true);
    });

    it('closes and clears the open attribute', async () => {
      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);

      el.open();
      el.close();

      expect(el.isOpen).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('closes when the close button is activated', async () => {
      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);
      el.open();

      part('close', el)?.dispatchEvent(new MouseEvent('click'));

      expect(el.isOpen).toBe(false);
    });
  });

  describe('events', () => {
    it('emits mh-callout-after-opened when opened', async () => {
      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);

      setTimeout(() => el.open());
      const event = await oneEvent(el, 'mh-callout-after-opened');

      expect(event).toBeInstanceOf(Event);
    });

    it('emits mh-callout-after-closed with the result when closed', async () => {
      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);
      el.open();

      setTimeout(() => el.close('dismissed'));
      const event = (await oneEvent(
        el,
        'mh-callout-after-closed',
      )) as CalloutAfterClosedEvent;

      expect(event.result).toBe('dismissed');
    });
  });

  describe('callout-close attribute', () => {
    it('closes with the attribute value when an action is activated', async () => {
      const el = await fixture<Callout>(html`
        <mh-callout>
          <span slot="title">Title</span>
          <button
            slot="actions"
            callout-close="ok"
          >
            OK
          </button>
        </mh-callout>
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

  describe('expansion mode', () => {
    it('renders a chevron toggle instead of a close button', async () => {
      const el = await fixture<Callout>(html`
        <mh-callout mode="expansion">
          <span slot="title">Title</span>
        </mh-callout>
      `);

      expect(part('toggle', el)).not.toBeNull();
      expect(part('close', el)).toBeNull();
    });

    it('hides the collapsible region when collapsed', async () => {
      const el = await fixture<Callout>(html`
        <mh-callout mode="expansion">
          <span slot="title">Title</span>
        </mh-callout>
      `);

      expect(part('region', el)?.hasAttribute('inert')).toBe(true);
    });

    it('toggles expanded when the title is activated and emits an event', async () => {
      const el = await fixture<Callout>(html`
        <mh-callout mode="expansion">
          <span slot="title">Title</span>
        </mh-callout>
      `);

      setTimeout(() =>
        part('title', el)?.dispatchEvent(
          new MouseEvent('click', { bubbles: true }),
        ),
      );
      const event = (await oneEvent(
        el,
        'mh-callout-expanded-changed',
      )) as CalloutExpandedChangedEvent;

      expect(event.expanded).toBe(true);
      expect(el.expanded).toBe(true);
      await el.updateComplete;
      expect(part('region', el)?.hasAttribute('inert')).toBe(false);
    });
  });
});
