import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import {
  assertAccessibility,
  getInternalsMock,
  part,
  polyfillAttachInternals,
  polyfillPopover,
} from '../core/testing';
import { getAllOptions } from '../form-control/option';

import '../form-control/option/option';
import type { Select } from './select';
import './select';

beforeAll(() => {
  polyfillPopover();
  polyfillAttachInternals();

  // Jsdom does not implement `innerText` (it depends on layout), but the component
  // relies on it to read/write plain text content. Fall back to `textContent`.
  if (!Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText'))
    Object.defineProperty(HTMLElement.prototype, 'innerText', {
      configurable: true,
      get() {
        return (this as HTMLElement).textContent ?? '';
      },
      set(value: string) {
        (this as HTMLElement).textContent = value;
      },
    });
});

describe('select', () => {
  const getToggleButton = (el: Select) =>
    part<HTMLButtonElement>('toggle-button', el);
  const getSelectedLabel = (el: Select) =>
    part<HTMLElement>('selected-label', el);
  const getListbox = (el: Select) => part<HTMLElement>('listbox', el);

  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-select
            name="a"
            placeholder="ph"
            >Label<mh-option value="x"></mh-option
          ></mh-select>`,
        ),
      );
    });

    it('is accessible when disabled', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-select
            name="b"
            placeholder="ph"
            disabled
          >
            Label
            <mh-option value="x"></mh-option>
          </mh-select>`,
        ),
      );
    });

    it('is accessible when required', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-select
            name="c"
            placeholder="ph"
            required
          >
            Label
            <mh-option value="x"></mh-option>
          </mh-select>`,
        ),
      );
    });

    it('is accessible when open with multiple options', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-select
            name="c2"
            placeholder="ph"
            open
          >
            Label
            <mh-option value="x">X</mh-option>
            <mh-option value="y">Y</mh-option>
          </mh-select>`,
        ),
      );
    });
  });

  describe('title', () => {
    it('has default empty title', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="d">Label</mh-select>`,
      );
      expect(el.title).toBe('');
    });

    it('reflects title to the host attribute', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="e"
          title="my title"
          >Label</mh-select
        >`,
      );
      expect(el.title).toBe('my title');
    });
  });

  describe('size', () => {
    it('defaults to "m"', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="f">Label</mh-select>`,
      );
      expect(el.size).toBe('m');
      expect(el.getAttribute('size')).toBe('m');
    });

    it('reflects size "s" to the host attribute', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="g"
          size="s"
          >Label</mh-select
        >`,
      );
      expect(el.size).toBe('s');
      expect(el.getAttribute('size')).toBe('s');
    });
  });

  describe('name', () => {
    it('reflects name to the host attribute', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="myfield">Label</mh-select>`,
      );
      expect(el.name).toBe('myfield');
      expect(el.getAttribute('name')).toBe('myfield');
    });
  });

  describe('value', () => {
    it('is undefined by default', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="h">Label</mh-select>`,
      );
      await el.updateComplete;
      expect(el.value).toBeUndefined();
    });

    it('picks up the value of the option marked as selected', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="i">
          Label
          <mh-option value="a">A</mh-option>
          <mh-option
            value="b"
            selected
            >B</mh-option
          >
        </mh-select>`,
      );
      await el.updateComplete;
      expect(el.value).toBe('b');
    });

    it('reflects value to the host attribute', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="j"
          value="x"
        >
          Label
          <mh-option value="x">X</mh-option>
        </mh-select>`,
      );
      await el.updateComplete;
      expect(el.getAttribute('value')).toBe('x');
    });

    it('marks the matching option as selected when value changes', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="k">
          Label
          <mh-option value="a">A</mh-option>
          <mh-option value="b">B</mh-option>
        </mh-select>`,
      );
      const [optionA, optionB] = getAllOptions(el);

      el.value = 'b';
      await el.updateComplete;

      expect(optionA?.hasAttribute('selected')).toBe(false);
      expect(optionB?.hasAttribute('selected')).toBe(true);
    });

    it('unmarks the previously selected option when value changes', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="l">
          Label
          <mh-option
            value="a"
            selected
            >A</mh-option
          >
          <mh-option value="b">B</mh-option>
        </mh-select>`,
      );
      const [optionA, optionB] = getAllOptions(el);
      expect(optionA?.hasAttribute('selected')).toBe(true);

      el.value = 'b';
      await el.updateComplete;

      expect(optionA?.hasAttribute('selected')).toBe(false);
      expect(optionB?.hasAttribute('selected')).toBe(true);
    });

    it('clears the selected option when value is set to null', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="m">
          Label
          <mh-option
            value="a"
            selected
            >A</mh-option
          >
        </mh-select>`,
      );
      const [optionA] = getAllOptions(el);

      el.value = null;
      await el.updateComplete;

      expect(optionA?.hasAttribute('selected')).toBe(false);
    });

    it('displays the selected option label in the toggle button', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="n">
          Label
          <mh-option
            value="a"
            selected
            >Alpha</mh-option
          >
          <mh-option value="b">Beta</mh-option>
        </mh-select>`,
      );
      expect(getSelectedLabel(el)?.textContent?.trim()).toBe('Alpha');
    });

    it('updates the displayed label when value changes', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="o">
          Label
          <mh-option
            value="a"
            selected
            >Alpha</mh-option
          >
          <mh-option value="b">Beta</mh-option>
        </mh-select>`,
      );

      el.value = 'b';
      await el.updateComplete;

      expect(getSelectedLabel(el)?.textContent?.trim()).toBe('Beta');
    });

    it('sets form value when the value property changes', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="p">
          Label
          <mh-option value="a">A</mh-option>
          <mh-option value="b">B</mh-option>
        </mh-select>`,
      );
      const { setFormValue } = getInternalsMock(el);

      el.value = 'b';
      await el.updateComplete;

      expect(setFormValue).toHaveBeenCalledWith('b');
    });
  });

  describe('placeholder', () => {
    it('is undefined by default', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="q">Label</mh-select>`,
      );
      expect(el.placeholder).toBeUndefined();
    });

    it('reflects placeholder to the host attribute', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="r"
          placeholder="Choose one"
          >Label</mh-select
        >`,
      );
      expect(el.getAttribute('placeholder')).toBe('Choose one');
    });

    it('is used as the toggle-button label when no value is selected', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="s"
          placeholder="Choose one"
        >
          Label
          <mh-option value="a">A</mh-option>
        </mh-select>`,
      );
      expect(getSelectedLabel(el)?.textContent?.trim()).toBe('Choose one');
    });

    it('is empty when there is no placeholder and no selected option', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="t">
          Label
          <mh-option value="a">A</mh-option>
        </mh-select>`,
      );
      expect(getSelectedLabel(el)?.textContent?.trim()).toBe('');
    });
  });

  describe('disabled', () => {
    it('is not disabled by default', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="u">Label</mh-select>`,
      );
      expect(el.disabled).toBe(false);
      expect(el.getAttribute('disabled')).toBeNull();
      expect(getToggleButton(el)?.disabled).toBe(false);
    });

    it('reflects disabled as a boolean attribute on the host', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="v"
          disabled
          >Label</mh-select
        >`,
      );
      expect(el.disabled).toBe(true);
      expect(el.getAttribute('disabled')).toBe('');
    });

    it('reflects disabled to the toggle button', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="w"
          disabled
          >Label</mh-select
        >`,
      );
      expect(getToggleButton(el)?.disabled).toBe(true);
    });
  });

  describe('required', () => {
    it('is not required by default', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="x">Label</mh-select>`,
      );
      expect(el.required).toBe(false);
      expect(el.getAttribute('required')).toBeNull();
    });

    it('reflects required as a boolean attribute on the host', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="y"
          required
          >Label</mh-select
        >`,
      );
      expect(el.required).toBe(true);
      expect(el.getAttribute('required')).toBe('');
    });
  });

  describe('help', () => {
    it('has no help text by default', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="z">Label</mh-select>`,
      );
      expect(el.help).toBeUndefined();
      expect(part('help', el)?.textContent?.trim()).toBe('');
    });

    it('reflects help to the host attribute', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="aa"
          help="Pick your favourite"
          >Label</mh-select
        >`,
      );
      expect(el.help).toBe('Pick your favourite');
      expect(el.getAttribute('help')).toBe('Pick your favourite');
    });

    it('renders help text in the help part', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="ab"
          help="Pick your favourite"
          >Label</mh-select
        >`,
      );
      expect(part('help', el)?.textContent?.trim()).toBe('Pick your favourite');
    });
  });

  describe('hint', () => {
    it('has no hint text by default', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="ac">Label</mh-select>`,
      );
      expect(el.hint).toBeUndefined();
      expect(part('hint', el)?.textContent?.trim()).toBe('');
    });

    it('reflects hint to the host attribute', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="ad"
          hint="You can change this later"
          >Label</mh-select
        >`,
      );
      expect(el.hint).toBe('You can change this later');
      expect(el.getAttribute('hint')).toBe('You can change this later');
    });

    it('renders hint text in the hint part', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="ae"
          hint="You can change this later"
          >Label</mh-select
        >`,
      );
      expect(part('hint', el)?.textContent?.trim()).toBe(
        'You can change this later',
      );
    });
  });

  describe('label', () => {
    it('moves plain text content into the label slot', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="af">
          My label
          <mh-option value="a">A</mh-option>
        </mh-select>`,
      );

      expect(el.label?.innerText.trim()).toBe('My label');
    });

    it('removes the original text nodes from the light DOM', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="ag">
          My label
          <mh-option value="a">A</mh-option>
        </mh-select>`,
      );

      const textNodes = Array.from(el.childNodes).filter(
        node => node.nodeType === Node.TEXT_NODE,
      );
      expect(textNodes.every(node => !node.textContent?.trim())).toBe(true);
    });
  });

  describe('open', () => {
    it('is closed by default', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="ah">Label</mh-select>`,
      );
      expect(el.open).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('opens and reflects the open attribute', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="ai">Label</mh-select>`,
      );

      el.toggle();
      await el.updateComplete;

      expect(el.open).toBe(true);
      expect(el.hasAttribute('open')).toBe(true);
    });

    it('closes when toggled again', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="aj">Label</mh-select>`,
      );

      el.toggle();
      el.toggle();
      await el.updateComplete;

      expect(el.open).toBe(false);
    });

    it('forces an explicit open state when passed', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="ak">Label</mh-select>`,
      );

      el.toggle(true);
      await el.updateComplete;
      expect(el.open).toBe(true);

      el.toggle(true);
      await el.updateComplete;
      expect(el.open).toBe(true);

      el.toggle(false);
      await el.updateComplete;
      expect(el.open).toBe(false);
    });

    it('shows the popover on the listbox when opened', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="al">
          Label
          <mh-option value="a">A</mh-option>
        </mh-select>`,
      );

      el.open = true;
      await el.updateComplete;

      expect(getListbox(el)?.hasAttribute('popover-open')).toBe(true);
    });

    it('hides the popover on the listbox when closed', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="am"
          open
        >
          Label
          <mh-option value="a">A</mh-option>
        </mh-select>`,
      );
      await el.updateComplete;

      el.open = false;
      await el.updateComplete;

      expect(getListbox(el)?.hasAttribute('popover-open')).toBe(false);
    });

    it('updates open state and dispatches a toggle event when the listbox toggles', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="an">
          Label
          <mh-option value="a">A</mh-option>
        </mh-select>`,
      );

      setTimeout(() =>
        getListbox(el)?.dispatchEvent(
          new ToggleEvent('toggle', { oldState: 'closed', newState: 'open' }),
        ),
      );
      const event = (await oneEvent(el, 'toggle')) as ToggleEvent;

      expect(el.open).toBe(true);
      expect(event.newState).toBe('open');
    });
  });

  describe('events', () => {
    it('emits focus and blur when focused and blurred', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="ao">Label</mh-select>`,
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

    it('triggers a click on the toggle button when click() is called', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="ap">Label</mh-select>`,
      );
      const clickHandler = vi.fn();

      getToggleButton(el)?.addEventListener('click', clickHandler);
      el.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);
    });

    it('selects the clicked option, closes the select and dispatches change', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="aq"
          open
        >
          Label
          <mh-option value="a">A</mh-option>
          <mh-option value="b">B</mh-option>
        </mh-select>`,
      );
      const [, optionB] = getAllOptions(el);
      const changeHandler = vi.fn();
      el.addEventListener('change', changeHandler);

      // This knows too much about the implementation, but JSDOM don't support no state selectors
      vi.spyOn(el, 'querySelector').mockReturnValueOnce(optionB);
      optionB?.dispatchEvent(
        new MouseEvent('mouseup', { bubbles: true, composed: true }),
      );
      await el.updateComplete;

      expect(el.value).toBe('b');
      expect(el.open).toBe(false);
      expect(changeHandler).toHaveBeenCalledTimes(1);
    });

    it('ignores mouseup events that do not target an option', async () => {
      const el = await fixture<Select>(
        html`<mh-select
          name="ar"
          open
        >
          Label
          <mh-option value="a">A</mh-option>
        </mh-select>`,
      );
      const changeHandler = vi.fn();
      el.addEventListener('change', changeHandler);

      vi.spyOn(el, 'querySelector').mockReturnValueOnce(getAllOptions(el)[0]);
      getListbox(el)?.dispatchEvent(
        new MouseEvent('mouseup', { bubbles: true, composed: true }),
      );
      await el.updateComplete;

      expect(changeHandler).not.toHaveBeenCalled();
      expect(el.open).toBe(true);
    });
  });

  describe('form association', () => {
    it('has role "combobox" via internals', async () => {
      const el = await fixture<Select>(
        html`<mh-select name="as">Label</mh-select>`,
      );
      expect(getInternalsMock(el).role).toBe('combobox');
    });

    describe('form reset', () => {
      it('restores value to the initial selected option after user changes it', async () => {
        const el = await fixture<Select>(
          html`<mh-select name="at">
            Label
            <mh-option
              value="a"
              selected
              >A</mh-option
            >
            <mh-option value="b">B</mh-option>
          </mh-select>`,
        );
        el.value = 'b';
        await el.updateComplete;

        el.formResetCallback();
        await el.updateComplete;

        expect(el.value).toBe('a');
      });

      it('restores value to null when no initial option was selected', async () => {
        const el = await fixture<Select>(
          html`<mh-select name="au">
            Label
            <mh-option value="a">A</mh-option>
            <mh-option value="b">B</mh-option>
          </mh-select>`,
        );
        el.value = 'b';
        await el.updateComplete;

        el.formResetCallback();
        await el.updateComplete;

        expect(el.value).toBeNull();
      });

      it('restores form value to the initial value on reset', async () => {
        const el = await fixture<Select>(
          html`<mh-select name="av">
            Label
            <mh-option
              value="a"
              selected
              >A</mh-option
            >
            <mh-option value="b">B</mh-option>
          </mh-select>`,
        );
        el.value = 'b';
        await el.updateComplete;

        const { setFormValue } = getInternalsMock(el);
        el.formResetCallback();
        await el.updateComplete;

        expect(setFormValue).toHaveBeenCalledWith('a');
      });
    });
  });
});
