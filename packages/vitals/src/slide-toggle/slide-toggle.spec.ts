import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import {
  assertAccessibility,
  part,
  polyfillElementInternals,
} from '../core/testing';

import './slide-toggle';
import type { SlideToggle } from './slide-toggle';

beforeAll(polyfillElementInternals);

describe('slide-toggle', () => {
  const getInput = (el: SlideToggle) => part<HTMLInputElement>('input', el);

  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-slide-toggle
            name="a"
            value="1"
            >Enable</mh-slide-toggle
          >`,
        ),
      );
    });

    it('is accessible when checked', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-slide-toggle
            name="b"
            value="1"
            checked
            >Enable</mh-slide-toggle
          >`,
        ),
      );
    });

    it('is accessible when disabled', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-slide-toggle
            name="c"
            value="1"
            disabled
            >Enable</mh-slide-toggle
          >`,
        ),
      );
    });
  });

  describe('title', () => {
    it('has default empty title', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="d"
          value="1"
          >Enable</mh-slide-toggle
        >`,
      );
      expect(el.title).toBe('');
      expect(getInput(el)?.getAttribute('title')).toBe('');
    });

    it('reflects title to the input element', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="e"
          value="1"
          title="my title"
          >Enable</mh-slide-toggle
        >`,
      );
      expect(el.title).toBe('my title');
      expect(getInput(el)?.getAttribute('title')).toBe('my title');
    });
  });

  describe('name', () => {
    it('reflects name to the host attribute', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="myfield"
          value="1"
          >Enable</mh-slide-toggle
        >`,
      );
      expect(el.name).toBe('myfield');
      expect(el.getAttribute('name')).toBe('myfield');
    });
  });

  describe('value', () => {
    it('reflects value to the host attribute', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="f"
          value="42"
          >Enable</mh-slide-toggle
        >`,
      );
      expect(el.value).toBe('42');
      expect(el.getAttribute('value')).toBe('42');
    });
  });

  describe('checked', () => {
    it('is not checked by default', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="g"
          value="1"
          >Enable</mh-slide-toggle
        >`,
      );
      expect(el.checked).toBe(false);
      expect(el.getAttribute('checked')).toBeNull();
      expect(getInput(el)?.checked).toBe(false);
    });

    it('reflects checked as a boolean attribute on the host', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="h"
          value="1"
          checked
          >Enable</mh-slide-toggle
        >`,
      );
      expect(el.checked).toBe(true);
      expect(el.getAttribute('checked')).toBe('');
    });

    it('reflects checked to the input element', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="i"
          value="1"
          checked
          >Enable</mh-slide-toggle
        >`,
      );
      expect(getInput(el)?.checked).toBe(true);
    });

    it('sets aria-checked to "true" when checked', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="j"
          value="1"
          checked
          >Enable</mh-slide-toggle
        >`,
      );
      expect(getInput(el)?.getAttribute('aria-checked')).toBe('true');
    });

    it('sets aria-checked to "false" when not checked', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="k"
          value="1"
          >Enable</mh-slide-toggle
        >`,
      );
      expect(getInput(el)?.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('disabled', () => {
    it('is not disabled by default', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="n"
          value="1"
          >Enable</mh-slide-toggle
        >`,
      );
      expect(el.disabled).toBe(false);
      expect(getInput(el)?.disabled).toBe(false);
    });

    it('reflects disabled to the input element', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="o"
          value="1"
          disabled
          >Enable</mh-slide-toggle
        >`,
      );
      expect(getInput(el)?.disabled).toBe(true);
    });
  });

  describe('slots', () => {
    it('renders start and end named slots in the component', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="lp1"
          value="1"
          >Enable</mh-slide-toggle
        >`,
      );
      expect(el.shadowRoot?.querySelector('slot[name="start"]')).not.toBeNull();
      expect(el.shadowRoot?.querySelector('slot[name="end"]')).not.toBeNull();
    });

    it('projects explicitly slotted start and end labels', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="lp2"
          value="1"
        >
          <span slot="start">On</span>
          <span slot="end">Off</span>
        </mh-slide-toggle>`,
      );

      const startSlot = el.shadowRoot?.querySelector(
        'slot[name="start"]',
      ) as HTMLSlotElement;
      const endSlot = el.shadowRoot?.querySelector(
        'slot[name="end"]',
      ) as HTMLSlotElement;

      expect(startSlot.assignedElements()[0]?.textContent?.trim()).toBe('On');
      expect(endSlot.assignedElements()[0]?.textContent?.trim()).toBe('Off');
    });

    it('treats default slot content as end label content', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="lp3"
          value="1"
          >Enable</mh-slide-toggle
        >`,
      );

      const endSlot = el.shadowRoot?.querySelector(
        'slot[name="end"]',
      ) as HTMLSlotElement;
      const endContent = endSlot
        .assignedNodes({ flatten: true })
        .map(node => node.textContent ?? '')
        .join(' ');

      expect(endContent).toContain('Enable');
    });
  });

  describe('form association', () => {
    it('does not set a role via internals (native input carries the semantics)', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="p"
          value="1"
          >Enable</mh-slide-toggle
        >`,
      );
      expect(el.internals.role).toBeNull();
    });

    it('sets form value when checked', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="q"
          value="yes"
          >Enable</mh-slide-toggle
        >`,
      );
      const setFormValue = vi.spyOn(el.internals, 'setFormValue');
      getInput(el)?.click();
      await el.updateComplete;

      expect(setFormValue).toHaveBeenCalledWith('yes');
    });

    it('clears form value when unchecked', async () => {
      const el = await fixture<SlideToggle>(
        html`<mh-slide-toggle
          name="r"
          value="yes"
          checked
          >Enable</mh-slide-toggle
        >`,
      );
      const setFormValue = vi.spyOn(el.internals, 'setFormValue');
      getInput(el)?.click();
      await el.updateComplete;

      expect(setFormValue).toHaveBeenCalledWith(null);
    });

    describe('form reset', () => {
      it('restores an unchecked toggle to unchecked after user checks it', async () => {
        const el = await fixture<SlideToggle>(
          html`<mh-slide-toggle
            name="s"
            value="yes"
            >Enable</mh-slide-toggle
          >`,
        );
        getInput(el)?.click();
        await el.updateComplete;
        expect(el.checked).toBe(true);

        el.formResetCallback();
        await el.updateComplete;

        expect(el.checked).toBe(false);
      });

      it('restores a checked toggle to checked after user unchecks it', async () => {
        const el = await fixture<SlideToggle>(
          html`<mh-slide-toggle
            name="t"
            value="yes"
            checked
            >Enable</mh-slide-toggle
          >`,
        );
        getInput(el)?.click();
        await el.updateComplete;
        expect(el.checked).toBe(false);

        el.formResetCallback();
        await el.updateComplete;

        expect(el.checked).toBe(true);
      });

      it('restores form value to checked value on reset', async () => {
        const el = await fixture<SlideToggle>(
          html`<mh-slide-toggle
            name="v"
            value="yes"
            checked
            >Enable</mh-slide-toggle
          >`,
        );
        getInput(el)?.click();
        await el.updateComplete;

        const setFormValue = vi.spyOn(el.internals, 'setFormValue');
        el.formResetCallback();

        expect(setFormValue).toHaveBeenCalledWith('yes');
      });

      it('clears form value on reset for unchecked default', async () => {
        const el = await fixture<SlideToggle>(
          html`<mh-slide-toggle
            name="w"
            value="yes"
            >Enable</mh-slide-toggle
          >`,
        );
        getInput(el)?.click();
        await el.updateComplete;

        const setFormValue = vi.spyOn(el.internals, 'setFormValue');
        el.formResetCallback();

        expect(setFormValue).toHaveBeenCalledWith(null);
      });
    });
  });
});
