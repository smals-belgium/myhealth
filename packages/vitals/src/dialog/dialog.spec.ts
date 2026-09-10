import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import {
  assertAccessibility,
  defaultSlot,
  part,
  polyfillDialog,
  slot,
} from '../core/testing';

import './dialog';
import type { DialogAfterClosedEvent } from './dialog-after-closed.event.js';
import type { Dialog } from './dialog.js';

beforeAll(polyfillDialog);

describe('dialog', () => {
  describe('accessibility', () => {
    it(`passes accessibility tests`, async () => {
      const el = await fixture<Dialog>(html`
        <mh-dialog>
          <h2 slot="header-title">Title</h2>
          <p>Body content</p>
          <button
            slot="actions"
            mh-dialog-close
          >
            Close
          </button>
        </mh-dialog>
      `);
      el.showModal();

      await assertAccessibility(el);
    });
  });

  describe('slots', () => {
    it('renders the header-title, content and actions slots', async () => {
      const el = await fixture<Dialog>(html`
        <mh-dialog>
          <span slot="header-title">Title</span>
          <span slot="header-actions">Header actions</span>
          <span>Content</span>
          <span slot="actions">Actions</span>
        </mh-dialog>
      `);

      expect(slot('header-title', el)?.assignedNodes().length).toBe(1);
      expect(slot('header-actions', el)?.assignedNodes().length).toBe(1);
      expect(defaultSlot(el)?.assignedElements().length).toBe(1);
      expect(slot('actions', el)?.assignedNodes().length).toBe(1);
    });
  });

  describe('variant', () => {
    it('defaults to the "basic" variant', async () => {
      const el = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);

      expect(el.variant).toBe('basic');
      expect(el.getAttribute('variant')).toBe('basic');
    });

    it('reflects the "fullscreen" variant to an attribute', async () => {
      const el = await fixture<Dialog>(
        html`<mh-dialog variant="fullscreen"></mh-dialog>`,
      );

      expect(el.variant).toBe('fullscreen');
      expect(el.getAttribute('variant')).toBe('fullscreen');
    });
  });

  describe('open / close', () => {
    it('is closed by default', async () => {
      const el = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);

      expect(el.open).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('opens as a modal and reflects the open attribute', async () => {
      const el = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);

      el.showModal();

      expect(el.open).toBe(true);
      expect(el.hasAttribute('open')).toBe(true);
    });

    it('closes and clears the open attribute', async () => {
      const el = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);

      el.showModal();
      el.close();

      expect(el.open).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('locks background scrolling while open and restores it when closed', async () => {
      const previousBodyOverflow = document.body.style.overflow;
      const previousDocumentOverflow = document.documentElement.style.overflow;

      const el = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);
      el.showModal();

      expect(document.body.style.overflow).toBe('hidden');
      expect(document.documentElement.style.overflow).toBe('hidden');

      el.close();

      expect(document.body.style.overflow).toBe(previousBodyOverflow);
      expect(document.documentElement.style.overflow).toBe(
        previousDocumentOverflow,
      );
    });

    it('keeps scroll locked until all open dialogs are closed', async () => {
      const first = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);
      const second = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);

      first.showModal();
      second.showModal();

      expect(document.body.style.overflow).toBe('hidden');
      first.close();

      expect(document.body.style.overflow).toBe('hidden');
      second.close();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('events', () => {
    it('emits mh-after-opened when opened', async () => {
      const el = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);

      setTimeout(() => el.showModal());
      const event = await oneEvent(el, 'mh-after-opened');

      expect(event).toBeInstanceOf(Event);
    });

    it('emits mh-after-closed with the result when closed', async () => {
      const el = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);
      el.showModal();

      setTimeout(() => el.close('confirmed'));
      const event = (await oneEvent(
        el,
        'mh-after-closed',
      )) as DialogAfterClosedEvent;

      expect(event.result).toBe('confirmed');
    });
  });

  describe('mh-dialog-close attribute', () => {
    it('closes with the attribute value when an action is activated', async () => {
      const el = await fixture<Dialog>(html`
        <mh-dialog>
          <button
            slot="actions"
            mh-dialog-close="ok"
          >
            OK
          </button>
        </mh-dialog>
      `);
      el.showModal();

      const button = el.querySelector('button');
      expect(button).not.toBeNull();
      setTimeout(() => button?.click());
      const event = (await oneEvent(
        el,
        'mh-after-closed',
      )) as DialogAfterClosedEvent;

      expect(event.result).toBe('ok');
      expect(el.open).toBe(false);
    });
  });

  describe('disable-close', () => {
    it('prevents the Escape key (cancel) from closing the dialog', async () => {
      const el = await fixture<Dialog>(
        html`<mh-dialog closedby="none"></mh-dialog>`,
      );
      el.showModal();

      const dialog = part<HTMLDialogElement>('dialog', el);
      const cancel = new Event('cancel', { cancelable: true });
      dialog?.dispatchEvent(cancel);

      expect(cancel.defaultPrevented).toBe(true);
    });
  });
});
