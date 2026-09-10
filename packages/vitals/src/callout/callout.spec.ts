import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import {
  assertAccessibility,
  defaultSlot,
  part,
  polyfillToggleEvent,
  slot,
  textContent,
} from '../core/testing';

import './callout';
import type { Callout } from './callout.js';

beforeAll(() => polyfillToggleEvent());

describe('callout', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      const el = await fixture<Callout>(html`
        <mh-callout>
          <span slot="title">Title</span>
          Description
          <button slot="actions">Dismiss</button>
        </mh-callout>
      `);

      await assertAccessibility(el);
    });
  });

  describe('slots', () => {
    it('renders the title, description and actions slots', async () => {
      const el = await fixture<Callout>(html`
        <mh-callout>
          <span slot="title">Title</span>
          Description
          <span slot="actions">Actions</span>
        </mh-callout>
      `);

      expect(slot('title', el)?.assignedNodes().length).toBe(1);
      expect(textContent(defaultSlot(el)!)).toBe('Description');
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
        html`<mh-callout variant="danger"></mh-callout>`,
      );

      expect(part('icon', el)?.getAttribute('name')).toBe('emergency_home');
    });
  });

  describe('appearance', () => {
    it('defaults to the "filled" appearance', async () => {
      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);

      expect(el.appearance).toBe('filled');
      expect(el.getAttribute('appearance')).toBe('filled');
    });

    it('reflects the "outlined" appearance to an attribute', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout appearance="outlined"></mh-callout>`,
      );

      expect(el.getAttribute('appearance')).toBe('outlined');
    });
  });

  describe('closable', () => {
    it('does not show the close button by default', async () => {
      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);

      expect(part('close', el)).toBeNull();
    });

    it('shows the close button when closable is set', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout closable></mh-callout>`,
      );

      expect(part('close', el)).toBeTruthy();
    });

    it('reflects closable as an attribute', async () => {
      const el = await fixture<Callout>(html`<mh-callout></mh-callout>`);
      el.closable = true;
      await el.updateComplete;

      expect(el.getAttribute('closable')).not.toBeNull();
    });
  });

  describe('close', () => {
    it('emits close and removes itself when the close button is activated', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout closable></mh-callout>`,
      );

      setTimeout(() =>
        part('close', el)?.dispatchEvent(new MouseEvent('click')),
      );
      const event = await oneEvent(el, 'close');

      expect(event).toBeInstanceOf(Event);
      expect(el.isConnected).toBe(false);
    });
  });

  describe('accessibility: ARIA roles and live regions', () => {
    it('sets role="alert" and aria-live="assertive" for danger variant', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout variant="danger"></mh-callout>`,
      );

      const region = part('content', el);
      expect(region?.getAttribute('role')).toBe('alert');
      expect(region?.getAttribute('aria-live')).toBe('assertive');
    });

    it('sets role="alert" and aria-live="assertive" for warning variant', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout variant="warning"></mh-callout>`,
      );

      const region = part('content', el);
      expect(region?.getAttribute('role')).toBe('alert');
      expect(region?.getAttribute('aria-live')).toBe('assertive');
    });

    it('sets role="status" and aria-live="polite" for info variant', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout variant="info"></mh-callout>`,
      );

      const region = part('content', el);
      expect(region?.getAttribute('role')).toBe('status');
      expect(region?.getAttribute('aria-live')).toBe('polite');
    });

    it('sets role="status" and aria-live="polite" for success variant', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout variant="success"></mh-callout>`,
      );

      const region = part('content', el);
      expect(region?.getAttribute('role')).toBe('status');
      expect(region?.getAttribute('aria-live')).toBe('polite');
    });

    it('sets role="status" and aria-live="polite" for neutral variant', async () => {
      const el = await fixture<Callout>(
        html`<mh-callout variant="neutral"></mh-callout>`,
      );

      const region = part('content', el);
      expect(region?.getAttribute('role')).toBe('status');
      expect(region?.getAttribute('aria-live')).toBe('polite');
    });
  });
});
