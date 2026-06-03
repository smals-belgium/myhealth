import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, part } from '../core/testing/index.js';

import './checkbox';
import type { Checkbox } from './checkbox.js';

const setFormValueSpy = vi.fn();

beforeAll(() => {
  if (
    typeof ElementInternals !== 'undefined' &&
    !ElementInternals.prototype.setFormValue
  )
    ElementInternals.prototype.setFormValue = setFormValueSpy;
});

beforeEach(() => setFormValueSpy.mockClear());

describe('checkbox', () => {
  const getInput = (el: Checkbox) => part<HTMLInputElement>('input', el);

  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-checkbox name="a" value="1">Option</mh-checkbox>`,
        ),
      );
    });

    it('is accessible when checked', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-checkbox name="b" value="1" checked>Option</mh-checkbox>`,
        ),
      );
    });

    it('is accessible when disabled', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-checkbox name="c" value="1" disabled>Option</mh-checkbox>`,
        ),
      );
    });
  });

  describe('title', () => {
    it('has default empty title', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="d" value="1">Option</mh-checkbox>`,
      );
      expect(el.title).toBe('');
      expect(getInput(el)?.getAttribute('title')).toBe('');
    });

    it('reflects title to the input element', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="e" value="1" title="my title"
          >Option</mh-checkbox
        >`,
      );
      expect(el.title).toBe('my title');
      expect(getInput(el)?.getAttribute('title')).toBe('my title');
    });
  });

  describe('name', () => {
    it('reflects name to the host attribute', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="myfield" value="1">Option</mh-checkbox>`,
      );
      expect(el.name).toBe('myfield');
      expect(el.getAttribute('name')).toBe('myfield');
    });
  });

  describe('value', () => {
    it('reflects value to the host attribute', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="f" value="42">Option</mh-checkbox>`,
      );
      expect(el.value).toBe('42');
      expect(el.getAttribute('value')).toBe('42');
    });
  });

  describe('checked', () => {
    it('is not checked by default', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="g" value="1">Option</mh-checkbox>`,
      );
      expect(el.checked).toBe(false);
      expect(el.getAttribute('checked')).toBeNull();
      expect(getInput(el)?.checked).toBe(false);
    });

    it('reflects checked as a boolean attribute on the host', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="h" value="1" checked>Option</mh-checkbox>`,
      );
      expect(el.checked).toBe(true);
      expect(el.getAttribute('checked')).toBe('');
    });

    it('reflects checked to the input element', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="i" value="1" checked>Option</mh-checkbox>`,
      );
      expect(getInput(el)?.checked).toBe(true);
    });

    it('sets aria-checked to "true" when checked', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="j" value="1" checked>Option</mh-checkbox>`,
      );
      expect(getInput(el)?.getAttribute('aria-checked')).toBe('true');
    });

    it('sets aria-checked to "false" when not checked', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="k" value="1">Option</mh-checkbox>`,
      );
      expect(getInput(el)?.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('indeterminate', () => {
    it('is not indeterminate by default', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="l" value="1">Option</mh-checkbox>`,
      );
      expect(el.indeterminate).toBe(false);
      expect(getInput(el)?.indeterminate).toBe(false);
    });

    it('sets indeterminate on the input element', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="m" value="1" indeterminate
          >Option</mh-checkbox
        >`,
      );
      expect(el.indeterminate).toBe(true);
      expect(getInput(el)?.indeterminate).toBe(true);
    });
  });

  describe('disabled', () => {
    it('is not disabled by default', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="n" value="1">Option</mh-checkbox>`,
      );
      expect(el.disabled).toBe(false);
      expect(getInput(el)?.disabled).toBe(false);
    });

    it('reflects disabled to the input element', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="o" value="1" disabled>Option</mh-checkbox>`,
      );
      expect(getInput(el)?.disabled).toBe(true);
    });
  });

  describe('form association', () => {
    it('has role "checkbox" via internals', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="p" value="1">Option</mh-checkbox>`,
      );
      expect(el.internals.role).toBe('checkbox');
    });

    it('sets form value when checked', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="q" value="yes">Option</mh-checkbox>`,
      );
      setFormValueSpy.mockClear();
      getInput(el)?.click();
      await el.updateComplete;

      expect(setFormValueSpy).toHaveBeenCalledWith('yes');
    });

    it('clears form value when unchecked', async () => {
      const el = await fixture<Checkbox>(
        html`<mh-checkbox name="r" value="yes" checked>Option</mh-checkbox>`,
      );
      setFormValueSpy.mockClear();
      getInput(el)?.click();
      await el.updateComplete;

      expect(setFormValueSpy).toHaveBeenCalledWith(null);
    });

    describe('form reset', () => {
      it('restores an unchecked checkbox to unchecked after user checks it', async () => {
        const el = await fixture<Checkbox>(
          html`<mh-checkbox name="s" value="yes">Option</mh-checkbox>`,
        );
        getInput(el)?.click();
        await el.updateComplete;
        expect(el.checked).toBe(true);

        el.formResetCallback();
        await el.updateComplete;

        expect(el.checked).toBe(false);
      });

      it('restores a checked checkbox to checked after user unchecks it', async () => {
        const el = await fixture<Checkbox>(
          html`<mh-checkbox name="t" value="yes" checked>Option</mh-checkbox>`,
        );
        getInput(el)?.click();
        await el.updateComplete;
        expect(el.checked).toBe(false);

        el.formResetCallback();
        await el.updateComplete;

        expect(el.checked).toBe(true);
      });

      it('restores indeterminate state to its initial value on reset', async () => {
        const el = await fixture<Checkbox>(
          html`<mh-checkbox name="u" value="yes" indeterminate
            >Option</mh-checkbox
          >`,
        );

        el.indeterminate = false;
        el.formResetCallback();
        await el.updateComplete;

        expect(el.indeterminate).toBe(true);
      });

      it('restores form value to checked value on reset', async () => {
        const el = await fixture<Checkbox>(
          html`<mh-checkbox name="v" value="yes" checked>Option</mh-checkbox>`,
        );
        getInput(el)?.click();
        await el.updateComplete;

        setFormValueSpy.mockClear();
        el.formResetCallback();

        expect(setFormValueSpy).toHaveBeenCalledWith('yes');
      });

      it('clears form value on reset for unchecked default', async () => {
        const el = await fixture<Checkbox>(
          html`<mh-checkbox name="w" value="yes">Option</mh-checkbox>`,
        );
        getInput(el)?.click();
        await el.updateComplete;

        setFormValueSpy.mockClear();
        el.formResetCallback();

        expect(setFormValueSpy).toHaveBeenCalledWith(null);
      });
    });
  });
});
