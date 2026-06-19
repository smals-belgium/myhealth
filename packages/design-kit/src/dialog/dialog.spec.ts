import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, defaultSlot, part, slot } from '../core/testing';

import './dialog';
import type { DialogAfterClosedEvent } from './dialog.event.js';
import type { Dialog } from './dialog.js';

// jsdom does not implement the native modal dialog APIs, so we polyfill the
// minimal behaviour the component relies on (open state + a `close` event).
beforeAll(() => {
  const proto = HTMLDialogElement.prototype as HTMLDialogElement & {
    showModal: () => void;
    show: () => void;
    close: (returnValue?: string) => void;
  };

  if (typeof proto.showModal !== 'function') {
    proto.showModal = function () {
      this.open = true;
    };
    proto.show = function () {
      this.open = true;
    };
    proto.close = function (returnValue?: string) {
      if (!this.open) return;
      this.open = false;
      if (returnValue !== undefined) this.returnValue = returnValue;
      this.dispatchEvent(new Event('cancel'));
      this.dispatchEvent(new Event('close'));
    };
  }
});

describe('dialog', () => {
  describe('accessibility', () => {
    it(`passes accessibility tests`, async () => {
      const el = await fixture<Dialog>(html`
        <mh-dialog>
          <h2 slot="header-title">Title</h2>
          <p>Body content</p>
          <button
            slot="actions"
            dialog-close
          >
            Close
          </button>
        </mh-dialog>
      `);
      el.open();

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

      expect(el.isOpen).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('opens as a modal and reflects the open attribute', async () => {
      const el = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);

      el.open();

      expect(el.isOpen).toBe(true);
      expect(el.hasAttribute('open')).toBe(true);
    });

    it('closes and clears the open attribute', async () => {
      const el = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);

      el.open();
      el.close();

      expect(el.isOpen).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('locks background scrolling while open and restores it when closed', async () => {
      const previousBodyOverflow = document.body.style.overflow;
      const previousDocumentOverflow = document.documentElement.style.overflow;

      const el = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);
      el.open();

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

      first.open();
      second.open();

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

      setTimeout(() => el.open());
      const event = await oneEvent(el, 'mh-after-opened');

      expect(event).toBeInstanceOf(Event);
    });

    it('emits mh-after-closed with the result when closed', async () => {
      const el = await fixture<Dialog>(html`<mh-dialog></mh-dialog>`);
      el.open();

      setTimeout(() => el.close('confirmed'));
      const event = (await oneEvent(
        el,
        'mh-after-closed',
      )) as DialogAfterClosedEvent;

      expect(event.result).toBe('confirmed');
    });
  });

  describe('dialog-close attribute', () => {
    it('closes with the attribute value when an action is activated', async () => {
      const el = await fixture<Dialog>(html`
        <mh-dialog>
          <button
            slot="actions"
            dialog-close="ok"
          >
            OK
          </button>
        </mh-dialog>
      `);
      el.open();

      const button = el.querySelector('button');
      expect(button).not.toBeNull();
      setTimeout(() => button?.click());
      const event = (await oneEvent(
        el,
        'mh-after-closed',
      )) as DialogAfterClosedEvent;

      expect(event.result).toBe('ok');
      expect(el.isOpen).toBe(false);
    });
  });

  describe('disable-close', () => {
    it('prevents the Escape key (cancel) from closing the dialog', async () => {
      const el = await fixture<Dialog>(
        html`<mh-dialog disable-close></mh-dialog>`,
      );
      el.open();

      const dialog = part<HTMLDialogElement>('dialog', el);
      const cancel = new Event('cancel', { cancelable: true });
      dialog?.dispatchEvent(cancel);

      expect(cancel.defaultPrevented).toBe(true);
    });
  });
});
