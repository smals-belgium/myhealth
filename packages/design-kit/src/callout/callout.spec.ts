import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, part, slot } from '../core/testing';

import './callout';
import type { CalloutAfterClosedEvent } from './callout-after-closed.event.js';
import type { Callout } from './callout.js';

describe('callout', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
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

  describe('accessibility: ARIA roles and live regions', () => {
    it('sets role="alert" and aria-live="assertive" for error variant', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout variant="error"></mh-callout>`,
      );
      el.open();

      const region = part('region', el);
      expect(region?.getAttribute('role')).toBe('alert');
      expect(region?.getAttribute('aria-live')).toBe('assertive');
    });

    it('sets role="alert" and aria-live="assertive" for warning variant', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout variant="warning"></mh-callout>`,
      );
      el.open();

      const region = part('region', el);
      expect(region?.getAttribute('role')).toBe('alert');
      expect(region?.getAttribute('aria-live')).toBe('assertive');
    });

    it('sets role="status" and aria-live="polite" for info variant', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout variant="info"></mh-callout>`,
      );
      el.open();

      const region = part('region', el);
      expect(region?.getAttribute('role')).toBe('status');
      expect(region?.getAttribute('aria-live')).toBe('polite');
    });

    it('sets role="status" and aria-live="polite" for success variant', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout variant="success"></mh-callout>`,
      );
      el.open();

      const region = part('region', el);
      expect(region?.getAttribute('role')).toBe('status');
      expect(region?.getAttribute('aria-live')).toBe('polite');
    });

    it('sets role="status" and aria-live="polite" for notification variant', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout variant="notification"></mh-callout>`,
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

      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);

      button.focus();
      expect(document.activeElement).toBe(button);

      el.open();
      el.close();

      // Focus should return to the button
      expect(document.activeElement).toBe(button);

      document.body.removeChild(button);
    });

    it('does not attempt to restore focus if trigger element was removed', async () => {
      const button = document.createElement('button');
      button.textContent = 'Open callout';
      document.body.appendChild(button);

      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);

      button.focus();
      el.open();

      // Remove the button before closing
      document.body.removeChild(button);

      // Should not throw when closing
      expect(() => el.close()).not.toThrow();
    });
  });
});
