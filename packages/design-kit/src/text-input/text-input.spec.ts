import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, part } from '../core/testing';

import './text-input';
import type { TextInput } from './text-input';

const setFormValueSpy = vi.fn();

beforeAll(() => {
  if (
    typeof ElementInternals !== 'undefined' &&
    !ElementInternals.prototype.setFormValue
  )
    ElementInternals.prototype.setFormValue = setFormValueSpy;
});

beforeEach(() => setFormValueSpy.mockClear());

describe('text-input', () => {
  const getInput = (el: TextInput) => part<HTMLInputElement>('input', el);

  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(html`<mh-text-input name="a">Label</mh-text-input>`),
      );
    });

    it('is accessible when disabled', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-text-input
            name="b"
            disabled
            >Label</mh-text-input
          >`,
        ),
      );
    });

    it('is accessible when required', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-text-input
            name="c"
            required
            >Label</mh-text-input
          >`,
        ),
      );
    });
  });

  describe('title', () => {
    it('has default empty title', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="d">Label</mh-text-input>`,
      );
      expect(el.title).toBe('');
      expect(getInput(el)?.getAttribute('title')).toBe('');
    });

    it('reflects title to the input element', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="e"
          title="my title"
          >Label</mh-text-input
        >`,
      );
      expect(el.title).toBe('my title');
      expect(getInput(el)?.getAttribute('title')).toBe('my title');
    });
  });

  describe('type', () => {
    it('defaults to "text"', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="f">Label</mh-text-input>`,
      );
      expect(el.type).toBe('text');
      expect(getInput(el)?.type).toBe('text');
    });

    (['email', 'password', 'search', 'tel', 'text', 'url'] as const).forEach(
      type => {
        it(`accepts type "${type}"`, async () => {
          const el = await fixture<TextInput>(
            html`<mh-text-input
              name="type-${type}"
              type=${type}
              >Label</mh-text-input
            >`,
          );
          expect(el.type).toBe(type);
          expect(getInput(el)?.type).toBe(type);
        });
      },
    );
  });

  describe('size', () => {
    it('defaults to "m"', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="g">Label</mh-text-input>`,
      );
      expect(el.size).toBe('m');
      expect(el.getAttribute('size')).toBe('m');
    });

    it('reflects size "s" to the host attribute', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="h"
          size="s"
          >Label</mh-text-input
        >`,
      );
      expect(el.size).toBe('s');
      expect(el.getAttribute('size')).toBe('s');
    });
  });

  describe('name', () => {
    it('reflects name to the host attribute', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="myfield">Label</mh-text-input>`,
      );
      expect(el.name).toBe('myfield');
      expect(el.getAttribute('name')).toBe('myfield');
    });
  });

  describe('value', () => {
    it('reflects value to the host attribute', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="i"
          value="hello"
          >Label</mh-text-input
        >`,
      );
      expect(el.value).toBe('hello');
      expect(el.getAttribute('value')).toBe('hello');
    });

    it('reflects value to the input element', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="j"
          value="hello"
          >Label</mh-text-input
        >`,
      );
      expect(getInput(el)?.value).toBe('hello');
    });

    it('sets form value when the value property changes', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="k"
          value="initial"
          >Label</mh-text-input
        >`,
      );
      setFormValueSpy.mockClear();
      el.value = 'updated';
      await el.updateComplete;

      expect(setFormValueSpy).toHaveBeenCalledWith('updated');
    });
  });

  describe('placeholder', () => {
    it('has no placeholder by default', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="l">Label</mh-text-input>`,
      );
      expect(getInput(el)?.hasAttribute('placeholder')).toBe(false);
    });

    it('reflects placeholder to the input element', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="m"
          placeholder="Enter text…"
          >Label</mh-text-input
        >`,
      );
      expect(getInput(el)?.getAttribute('placeholder')).toBe('Enter text…');
    });
  });

  describe('disabled', () => {
    it('is not disabled by default', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="n">Label</mh-text-input>`,
      );
      expect(el.disabled).toBe(false);
      expect(el.getAttribute('disabled')).toBeNull();
      expect(getInput(el)?.disabled).toBe(false);
    });

    it('reflects disabled as a boolean attribute on the host', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="o"
          disabled
          >Label</mh-text-input
        >`,
      );
      expect(el.disabled).toBe(true);
      expect(el.getAttribute('disabled')).toBe('');
    });

    it('reflects disabled to the input element', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="p"
          disabled
          >Label</mh-text-input
        >`,
      );
      expect(getInput(el)?.disabled).toBe(true);
    });
  });

  describe('required', () => {
    it('is not required by default', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="q">Label</mh-text-input>`,
      );
      expect(el.required).toBe(false);
      expect(el.getAttribute('required')).toBeNull();
      expect(getInput(el)?.required).toBe(false);
    });

    it('reflects required as a boolean attribute on the host', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="r"
          required
          >Label</mh-text-input
        >`,
      );
      expect(el.required).toBe(true);
      expect(el.getAttribute('required')).toBe('');
    });

    it('reflects required to the input element', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="s"
          required
          >Label</mh-text-input
        >`,
      );
      expect(getInput(el)?.required).toBe(true);
    });
  });

  describe('pattern', () => {
    it('has no pattern by default', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="t">Label</mh-text-input>`,
      );
      expect(getInput(el)?.hasAttribute('pattern')).toBe(false);
    });

    it('reflects pattern to the input element', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="u"
          pattern="[A-Z]+"
          >Label</mh-text-input
        >`,
      );
      expect(getInput(el)?.getAttribute('pattern')).toBe('[A-Z]+');
    });
  });

  describe('minlength', () => {
    it('has no minlength by default', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="v">Label</mh-text-input>`,
      );
      expect(getInput(el)?.hasAttribute('minlength')).toBe(false);
    });

    it('reflects minlength to the input element', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="w"
          minlength="3"
          >Label</mh-text-input
        >`,
      );
      expect(getInput(el)?.minLength).toBe(3);
    });
  });

  describe('maxlength', () => {
    it('has no maxlength by default', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="x">Label</mh-text-input>`,
      );
      expect(getInput(el)?.hasAttribute('maxlength')).toBe(false);
    });

    it('reflects maxlength to the input element', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="y"
          maxlength="10"
          >Label</mh-text-input
        >`,
      );
      expect(getInput(el)?.maxLength).toBe(10);
    });
  });

  describe('help', () => {
    it('has no help text by default', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="z">Label</mh-text-input>`,
      );
      expect(el.help).toBeUndefined();
      expect(part('help', el)?.textContent?.trim()).toBe('');
    });

    it('reflects help to the host attribute', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="aa"
          help="Enter your full name"
          >Label</mh-text-input
        >`,
      );
      expect(el.help).toBe('Enter your full name');
      expect(el.getAttribute('help')).toBe('Enter your full name');
    });

    it('renders help text in the help part', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="ab"
          help="Enter your full name"
          >Label</mh-text-input
        >`,
      );
      expect(part('help', el)?.textContent?.trim()).toBe(
        'Enter your full name',
      );
    });
  });

  describe('hint', () => {
    it('has no hint text by default', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="ac">Label</mh-text-input>`,
      );
      expect(el.hint).toBeUndefined();
      expect(part('hint', el)?.textContent?.trim()).toBe('');
    });

    it('reflects hint to the host attribute', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="ad"
          hint="Format: name@example.com"
          >Label</mh-text-input
        >`,
      );
      expect(el.hint).toBe('Format: name@example.com');
      expect(el.getAttribute('hint')).toBe('Format: name@example.com');
    });

    it('renders hint text in the hint part', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input
          name="ae"
          hint="Format: name@example.com"
          >Label</mh-text-input
        >`,
      );
      expect(part('hint', el)?.textContent?.trim()).toBe(
        'Format: name@example.com',
      );
    });
  });

  describe('events', () => {
    it('emits focus and blur when focused and blurred', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="af">Label</mh-text-input>`,
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
      const el = await fixture<TextInput>(
        html`<mh-text-input name="ag">Label</mh-text-input>`,
      );
      const clickHandler = vi.fn();

      getInput(el)?.addEventListener('click', clickHandler);
      el.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('form association', () => {
    it('sets form value on the change event', async () => {
      const el = await fixture<TextInput>(
        html`<mh-text-input name="ah">Label</mh-text-input>`,
      );
      const input = getInput(el);
      setFormValueSpy.mockClear();
      if (input) {
        input.value = 'typed text';
        input.dispatchEvent(new Event('change'));
      }
      await el.updateComplete;

      expect(setFormValueSpy).toHaveBeenCalledWith('typed text');
    });

    describe('form reset', () => {
      it('restores value to the initial value after user changes it', async () => {
        const el = await fixture<TextInput>(
          html`<mh-text-input
            name="ai"
            value="original"
            >Label</mh-text-input
          >`,
        );
        el.value = 'modified';
        await el.updateComplete;

        el.formResetCallback();
        await el.updateComplete;

        expect(el.value).toBe('original');
      });

      it('restores value to null when no initial value was set', async () => {
        const el = await fixture<TextInput>(
          html`<mh-text-input name="aj">Label</mh-text-input>`,
        );
        el.value = 'modified';
        await el.updateComplete;

        el.formResetCallback();
        await el.updateComplete;

        expect(el.value).toBeNull();
      });

      it('restores form value to the initial value on reset', async () => {
        const el = await fixture<TextInput>(
          html`<mh-text-input
            name="ak"
            value="original"
            >Label</mh-text-input
          >`,
        );
        el.value = 'modified';
        await el.updateComplete;

        setFormValueSpy.mockClear();
        el.formResetCallback();

        expect(setFormValueSpy).toHaveBeenCalledWith('original');
      });

      it('clears form value on reset when no initial value was set', async () => {
        const el = await fixture<TextInput>(
          html`<mh-text-input name="al">Label</mh-text-input>`,
        );
        el.value = 'modified';
        await el.updateComplete;

        setFormValueSpy.mockClear();
        el.formResetCallback();

        expect(setFormValueSpy).toHaveBeenCalledWith(null);
      });
    });
  });
});
