import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, part } from '../core/testing/index.js';

import './radio';
import type { Radio } from './radio.js';

// JSDOM does not implement ElementInternals.setFormValue; polyfill it so form-
// associated behaviour (which calls setFormValue inside radioGroups.updateValue)
// does not throw and break unrelated assertions.
const setFormValueSpy = vi.fn();

beforeAll(() => {
  if (
    typeof ElementInternals !== 'undefined' &&
    !ElementInternals.prototype.setFormValue
  )
    ElementInternals.prototype.setFormValue = setFormValueSpy;
});

beforeEach(() => setFormValueSpy.mockClear());

describe('radio', () => {
  const getInput = (el: Radio) => part<HTMLInputElement>('input', el);

  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(html`<mh-radio name="a" value="1">Option 1</mh-radio>`),
      );
    });

    it('is accessible when checked', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-radio name="b" value="1" checked>Option 1</mh-radio>`,
        ),
      );
    });

    it('is accessible when disabled', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-radio name="c" value="1" disabled>Option 1</mh-radio>`,
        ),
      );
    });
  });

  describe('title', () => {
    it('has default empty title', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="d" value="1">Option</mh-radio>`,
      );
      expect(el.title).toBe('');
      expect(getInput(el)?.getAttribute('title')).toBe('');
    });

    it('reflects title to the input element', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="e" value="1" title="my title">Option</mh-radio>`,
      );
      expect(el.title).toBe('my title');
      expect(getInput(el)?.getAttribute('title')).toBe('my title');
    });
  });

  describe('name', () => {
    it('reflects name to the host attribute', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="mygroup" value="1">Option</mh-radio>`,
      );
      expect(el.name).toBe('mygroup');
      expect(el.getAttribute('name')).toBe('mygroup');
    });

    it('reflects name to the input element', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="mygroup" value="1">Option</mh-radio>`,
      );
      expect(getInput(el)?.getAttribute('name')).toBe('mygroup');
    });
  });

  describe('value', () => {
    it('reflects value to the host attribute', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="f" value="42">Option</mh-radio>`,
      );
      expect(el.value).toBe('42');
      expect(el.getAttribute('value')).toBe('42');
    });

    it('reflects value to the input element', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="g" value="42">Option</mh-radio>`,
      );
      expect(getInput(el)?.getAttribute('value')).toBe('42');
    });
  });

  describe('checked', () => {
    it('is not checked by default', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="h" value="1">Option</mh-radio>`,
      );
      expect(el.checked).toBe(false);
      expect(el.getAttribute('checked')).toBeNull();
      expect(getInput(el)?.checked).toBe(false);
    });

    it('reflects checked as a boolean attribute on the host', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="i" value="1" checked>Option</mh-radio>`,
      );
      expect(el.checked).toBe(true);
      expect(el.getAttribute('checked')).toBe('');
    });

    it('reflects checked to the input element', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="j" value="1" checked>Option</mh-radio>`,
      );
      expect(getInput(el)?.checked).toBe(true);
    });

    it('sets aria-checked to "true" when checked', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="k" value="1" checked>Option</mh-radio>`,
      );
      expect(getInput(el)?.getAttribute('aria-checked')).toBe('true');
    });

    it('sets aria-checked to "false" when not checked', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="l" value="1">Option</mh-radio>`,
      );
      expect(getInput(el)?.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('disabled', () => {
    it('is not disabled by default', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="m" value="1">Option</mh-radio>`,
      );
      expect(el.disabled).toBe(false);
      expect(el.getAttribute('disabled')).toBeNull();
      expect(getInput(el)?.disabled).toBe(false);
    });

    it('reflects disabled as a boolean attribute on the host', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="n" value="1" disabled>Option</mh-radio>`,
      );
      expect(el.disabled).toBe(true);
      expect(el.getAttribute('disabled')).toBe('');
    });

    it('reflects disabled to the input element', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="o" value="1" disabled>Option</mh-radio>`,
      );
      expect(getInput(el)?.disabled).toBe(true);
    });
  });

  describe('required', () => {
    it('is not required by default', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="p" value="1">Option</mh-radio>`,
      );
      expect(el.required).toBe(false);
      expect(el.getAttribute('required')).toBeNull();
      expect(getInput(el)?.required).toBe(false);
    });

    it('reflects required as a boolean attribute on the host', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="q" value="1" required>Option</mh-radio>`,
      );
      expect(el.required).toBe(true);
      expect(el.getAttribute('required')).toBe('');
    });

    it('reflects required to the input element', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="r" value="1" required>Option</mh-radio>`,
      );
      expect(getInput(el)?.required).toBe(true);
    });
  });

  describe('events', () => {
    it('emits focus and blur when focused and blurred', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="s" value="1">Option</mh-radio>`,
      );
      const focusHandler = vi.fn();
      const blurHandler = vi.fn();

      el.addEventListener('focus', focusHandler);
      el.addEventListener('blur', blurHandler);
      el.focus();
      el.blur();

      expect(focusHandler).toHaveBeenCalledTimes(1);
      expect(blurHandler).toHaveBeenCalledTimes(1);
    });

    it('triggers a click on the internal input when click() is called', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="t" value="1">Option</mh-radio>`,
      );
      const clickHandler = vi.fn();

      getInput(el)?.addEventListener('click', clickHandler);
      el.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('radio group behaviour', () => {
    it('unchecks other radios in the same group when one is checked', async () => {
      const group = await fixture<HTMLDivElement>(html`
        <div>
          <mh-radio name="group-u" value="a" checked>A</mh-radio>
          <mh-radio name="group-u" value="b">B</mh-radio>
          <mh-radio name="group-u" value="c">C</mh-radio>
        </div>
      `);

      const [, r2, r3] = Array.from(group.querySelectorAll<Radio>('mh-radio'));

      getInput(r2)?.click();
      await r2.updateComplete;
      expect(r2.checked).toBe(true);
      expect(r3.checked).toBe(false);
    });

    it('does not affect radios in a different group', async () => {
      const container = await fixture<HTMLDivElement>(html`
        <div>
          <mh-radio name="group-v1" value="x" checked>X</mh-radio>
          <mh-radio name="group-v2" value="y" checked>Y</mh-radio>
        </div>
      `);

      const [r1, r2] = Array.from(
        container.querySelectorAll<Radio>('mh-radio'),
      );

      expect(r1.checked).toBe(true);
      expect(r2.checked).toBe(true);
    });
  });

  describe('form association', () => {
    it('has role "radio" via internals', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="w" value="1">Option</mh-radio>`,
      );
      expect(el.internals.role).toBe('radio');
    });

    it('sets form value when checked', async () => {
      const el = await fixture<Radio>(
        html`<mh-radio name="group-x" value="selected">Option</mh-radio>`,
      );
      setFormValueSpy.mockClear();
      getInput(el)?.click();
      await el.updateComplete;

      expect(setFormValueSpy).toHaveBeenCalledWith('selected');
    });

    it('clears form value of deselected radio when another is selected', async () => {
      const container = await fixture<HTMLDivElement>(html`
        <div>
          <mh-radio name="group-y" value="a" checked>A</mh-radio>
          <mh-radio name="group-y" value="b">B</mh-radio>
        </div>
      `);

      const [, r2] = Array.from(container.querySelectorAll<Radio>('mh-radio'));

      setFormValueSpy.mockClear();
      getInput(r2)?.click();
      await r2.updateComplete;

      // null for the deselected radio, 'b' for the selected one
      expect(setFormValueSpy).toHaveBeenCalledWith(null);
      expect(setFormValueSpy).toHaveBeenCalledWith('b');
    });
  });
});
