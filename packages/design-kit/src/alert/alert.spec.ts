import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { liveAnnouncer } from '../core/live-announcer';
import { assertAccessibility, part, slot } from '../core/testing';

import './alert';
import type { AlertAfterClosedEvent } from './alert-after-closed.event.js';
import type { AlertExpandedChangedEvent } from './alert-expanded-changed.event.js';
import type { Alert } from './alert.js';

describe('alert', () => {
  describe('accessibility', () => {
    it('passes accessibility tests in normal mode', async () => {
      const el = await fixture<Alert>(html`
        <mh-alert>
          <span slot="title">Title</span>
          <span slot="description">Description</span>
          <button
            slot="actions"
            alert-close
          >
            Dismiss
          </button>
        </mh-alert>
      `);
      el.open();

      await assertAccessibility(el);
    });

    it('passes accessibility tests in expansion mode', async () => {
      const el = await fixture<Alert>(html`
        <mh-alert mode="expansion">
          <span slot="title">Title</span>
          <span slot="description">Description</span>
        </mh-alert>
      `);
      el.open();

      await assertAccessibility(el);
    });
  });

  describe('slots', () => {
    it('renders the title, description and actions slots', async () => {
      const el = await fixture<Alert>(html`
        <mh-alert>
          <span slot="title">Title</span>
          <span slot="description">Description</span>
          <span slot="actions">Actions</span>
        </mh-alert>
      `);

      expect(slot('title', el)?.assignedNodes().length).toBe(1);
      expect(slot('description', el)?.assignedNodes().length).toBe(1);
      expect(slot('actions', el)?.assignedNodes().length).toBe(1);
    });
  });

  describe('variant', () => {
    it('defaults to the "info" variant', async () => {
      const el = await fixture<Alert>(html`<mh-alert></mh-alert>`);

      expect(el.variant).toBe('info');
      expect(el.getAttribute('variant')).toBe('info');
    });

    it('shows the icon mapped to the variant', async () => {
      const el = await fixture<Alert>(
        html`<mh-alert variant="error"></mh-alert>`,
      );

      expect(part('icon', el)?.getAttribute('name')).toBe('emergency_home');
    });
  });

  describe('appearance', () => {
    it('defaults to the "color" appearance', async () => {
      const el = await fixture<Alert>(html`<mh-alert></mh-alert>`);

      expect(el.appearance).toBe('color');
      expect(el.getAttribute('appearance')).toBe('color');
    });

    it('reflects the "white" appearance to an attribute', async () => {
      const el = await fixture<Alert>(
        html`<mh-alert appearance="white"></mh-alert>`,
      );

      expect(el.getAttribute('appearance')).toBe('white');
    });
  });

  describe('open / close', () => {
    it('is closed by default', async () => {
      const el = await fixture<Alert>(html`<mh-alert></mh-alert>`);

      expect(el.isOpen).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('opens and reflects the open attribute', async () => {
      const el = await fixture<Alert>(html`<mh-alert></mh-alert>`);

      el.open();

      expect(el.isOpen).toBe(true);
      expect(el.hasAttribute('open')).toBe(true);
    });

    it('closes and clears the open attribute', async () => {
      const el = await fixture<Alert>(html`<mh-alert></mh-alert>`);

      el.open();
      el.close();

      expect(el.isOpen).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('closes when the close button is activated', async () => {
      const el = await fixture<Alert>(html`<mh-alert></mh-alert>`);
      el.open();

      part('close', el)?.dispatchEvent(new MouseEvent('click'));

      expect(el.isOpen).toBe(false);
    });
  });

  describe('events', () => {
    it('emits mh-alert-after-opened when opened', async () => {
      const el = await fixture<Alert>(html`<mh-alert></mh-alert>`);

      setTimeout(() => el.open());
      const event = await oneEvent(el, 'mh-alert-after-opened');

      expect(event).toBeInstanceOf(Event);
    });

    it('emits mh-alert-after-closed with the result when closed', async () => {
      const el = await fixture<Alert>(html`<mh-alert></mh-alert>`);
      el.open();

      setTimeout(() => el.close('dismissed'));
      const event = (await oneEvent(
        el,
        'mh-alert-after-closed',
      )) as AlertAfterClosedEvent;

      expect(event.result).toBe('dismissed');
    });
  });

  describe('alert-close attribute', () => {
    it('closes with the attribute value when an action is activated', async () => {
      const el = await fixture<Alert>(html`
        <mh-alert>
          <span slot="title">Title</span>
          <button
            slot="actions"
            alert-close="ok"
          >
            OK
          </button>
        </mh-alert>
      `);
      el.open();

      const button = el.querySelector('button');
      setTimeout(() => button?.click());
      const event = (await oneEvent(
        el,
        'mh-alert-after-closed',
      )) as AlertAfterClosedEvent;

      expect(event.result).toBe('ok');
      expect(el.isOpen).toBe(false);
    });
  });

  describe('expansion mode', () => {
    it('renders a chevron toggle instead of a close button', async () => {
      const el = await fixture<Alert>(html`
        <mh-alert mode="expansion">
          <span slot="title">Title</span>
        </mh-alert>
      `);

      expect(part('toggle', el)).not.toBeNull();
      expect(part('close', el)).toBeNull();
    });

    it('hides the collapsible region when collapsed', async () => {
      const el = await fixture<Alert>(html`
        <mh-alert mode="expansion">
          <span slot="title">Title</span>
        </mh-alert>
      `);

      expect(part('region', el)?.hasAttribute('inert')).toBe(true);
    });

    it('toggles expanded when the title is activated and emits an event', async () => {
      const el = await fixture<Alert>(html`
        <mh-alert mode="expansion">
          <span slot="title">Title</span>
        </mh-alert>
      `);

      setTimeout(() =>
        part('title', el)?.dispatchEvent(
          new MouseEvent('click', { bubbles: true }),
        ),
      );
      const event = (await oneEvent(
        el,
        'mh-alert-expanded-changed',
      )) as AlertExpandedChangedEvent;

      expect(event.expanded).toBe(true);
      expect(el.expanded).toBe(true);
      await el.updateComplete;
      expect(part('region', el)?.hasAttribute('inert')).toBe(false);
    });
  });

  describe('announcements', () => {
    it('announces the title and description with the configured politeness', async () => {
      const el = await fixture<Alert>(html`
        <mh-alert politeness="assertive">
          <span slot="title">Saved</span>
          <span slot="description">Your changes were stored</span>
        </mh-alert>
      `);

      el.open();
      const { region } = liveAnnouncer;

      expect(region?.getAttribute('aria-live')).toBe('assertive');
    });
  });
});
