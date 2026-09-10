import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';

import {
  assertAccessibility,
  getInternalsMock,
  part,
  polyfillAttachInternals,
} from '../core/testing';
import '../form-control/option/option';
import '../icon-button';
import type { IconButton } from '../icon-button';

import type { ActivateSelectionEvent } from './activate-selection.event';
import type { Iterator } from './iterator';
import './iterator';

beforeAll(polyfillAttachInternals);

describe('iterator', () => {
  const getPreviousButton = (el: Iterator) =>
    part<IconButton>('previous-button', el);
  const getNextButton = (el: Iterator) => part<IconButton>('next-button', el);
  const getSelection = (el: Iterator) => part<HTMLElement>('selection', el);

  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-iterator
            name="a"
            title="Year"
          >
            <mh-option value="x">X</mh-option>
            <mh-option value="y">Y</mh-option>
          </mh-iterator>`,
        ),
      );
    });

    it('is accessible when disabled', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-iterator
            name="b"
            title="Year"
            disabled
          >
            <mh-option value="x">X</mh-option>
            <mh-option value="y">Y</mh-option>
          </mh-iterator>`,
        ),
      );
    });

    it('is accessible with interactive selection', async () => {
      await assertAccessibility(
        await fixture(
          html`<mh-iterator
            name="c"
            title="Year"
            interactive-selection
          >
            <mh-option value="x">X</mh-option>
            <mh-option value="y">Y</mh-option>
          </mh-iterator>`,
        ),
      );
    });

    it('sets the accessible name of the selection from the title property', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator
          name="af"
          title="Year"
        >
          <mh-option value="x">X</mh-option>
        </mh-iterator>`,
      );
      expect(getSelection(el)?.getAttribute('aria-label')).toBe('Year');
    });
  });

  describe('title', () => {
    it('has default empty title', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="ag">
          <mh-option value="x">X</mh-option>
        </mh-iterator>`,
      );
      expect(el.title).toBe('');
    });
  });

  describe('size', () => {
    it('has default size "m"', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="d">
          <mh-option value="x">X</mh-option>
        </mh-iterator>`,
      );
      expect(el.size).toBe('m');
      expect(el.getAttribute('size')).toBe('m');
    });

    it('reflects size to the host attribute', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator
          name="e"
          size="s"
        >
          <mh-option value="x">X</mh-option>
        </mh-iterator>`,
      );
      expect(el.size).toBe('s');
      expect(el.getAttribute('size')).toBe('s');
    });
  });

  describe('name', () => {
    it('reflects name to an attribute', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="f">
          <mh-option value="x">X</mh-option>
        </mh-iterator>`,
      );
      expect(el.name).toBe('f');
      expect(el.getAttribute('name')).toBe('f');
    });
  });

  describe('value', () => {
    it('defaults to the first option when no option is selected', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="g">
          <mh-option value="a">A</mh-option>
          <mh-option value="b">B</mh-option>
        </mh-iterator>`,
      );
      expect(el.value).toBe('a');
    });

    it('picks up the value of the option marked as selected', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="h">
          <mh-option value="a">A</mh-option>
          <mh-option
            value="b"
            selected
            >B</mh-option
          >
        </mh-iterator>`,
      );
      expect(el.value).toBe('b');
    });

    it('reflects value to the host attribute', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="i">
          <mh-option value="a">A</mh-option>
          <mh-option
            value="b"
            selected
            >B</mh-option
          >
        </mh-iterator>`,
      );
      expect(el.getAttribute('value')).toBe('b');
    });

    it('marks the matching option as selected when value changes', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="j">
          <mh-option value="a">A</mh-option>
          <mh-option value="b">B</mh-option>
        </mh-iterator>`,
      );

      el.value = 'b';
      await el.updateComplete;

      expect(el.querySelector('[value="a"]')?.hasAttribute('selected')).toBe(
        false,
      );
      expect(el.querySelector('[value="b"]')?.hasAttribute('selected')).toBe(
        true,
      );
    });
  });

  describe('disabled', () => {
    it('is not disabled by default', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="k">
          <mh-option value="x">X</mh-option>
        </mh-iterator>`,
      );
      expect(el.disabled).toBe(false);
      expect(el.getAttribute('disabled')).toBeNull();
    });

    it('reflects disabled as a boolean attribute', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator
          name="l"
          disabled
        >
          <mh-option value="x">X</mh-option>
        </mh-iterator>`,
      );
      expect(el.disabled).toBe(true);
      expect(el.getAttribute('disabled')).toBe('');
    });

    it('disables the previous and next buttons', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator
          name="m"
          disabled
        >
          <mh-option value="a">A</mh-option>
          <mh-option
            value="b"
            selected
            >B</mh-option
          >
          <mh-option value="c">C</mh-option>
        </mh-iterator>`,
      );
      expect(getPreviousButton(el)?.disabled).toBe(true);
      expect(getNextButton(el)?.disabled).toBe(true);
    });

    it('propagates disabled to all options', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator
          name="n"
          disabled
        >
          <mh-option value="a">A</mh-option>
          <mh-option value="b">B</mh-option>
        </mh-iterator>`,
      );
      const options = Array.from(el.querySelectorAll('mh-option'));
      expect(options.every(option => option.disabled)).toBe(true);
    });

    it('does not emit mh-activate-selection when clicking the selection while disabled', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator
          name="o"
          disabled
        >
          <mh-option value="a">A</mh-option>
        </mh-iterator>`,
      );
      const activateHandler = vi.fn();

      el.addEventListener('mh-activate-selection', activateHandler);
      getSelection(el)?.dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      );

      expect(activateHandler).not.toHaveBeenCalled();
    });
  });

  describe('interactive-selection', () => {
    it('is not interactive by default', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="p">
          <mh-option value="x">X</mh-option>
        </mh-iterator>`,
      );
      expect(el.interactiveSelection).toBe(false);
      expect(el.getAttribute('interactive-selection')).toBeNull();
    });

    it('reflects interactive-selection as a boolean attribute', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator
          name="q"
          interactive-selection
        >
          <mh-option value="x">X</mh-option>
        </mh-iterator>`,
      );
      expect(el.interactiveSelection).toBe(true);
      expect(el.getAttribute('interactive-selection')).toBe('');
    });

    it('marks options as disabled when interactive selection is off', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="r">
          <mh-option value="x">X</mh-option>
        </mh-iterator>`,
      );
      expect(el.querySelector('mh-option')?.disabled).toBe(true);
    });

    it('marks options as enabled when interactive selection is on', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator
          name="s"
          interactive-selection
        >
          <mh-option value="x">X</mh-option>
        </mh-iterator>`,
      );
      expect(el.querySelector('mh-option')?.disabled).toBe(false);
    });
  });

  describe('navigation', () => {
    it('disables the previous button when the first option is active', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="t">
          <mh-option value="a">A</mh-option>
          <mh-option value="b">B</mh-option>
        </mh-iterator>`,
      );
      expect(getPreviousButton(el)?.disabled).toBe(true);
      expect(getNextButton(el)?.disabled).toBe(false);
    });

    it('disables the next button when the last option is active', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="u">
          <mh-option value="a">A</mh-option>
          <mh-option
            value="b"
            selected
            >B</mh-option
          >
        </mh-iterator>`,
      );
      expect(getPreviousButton(el)?.disabled).toBe(false);
      expect(getNextButton(el)?.disabled).toBe(true);
    });

    it('selects the next value when the next button is clicked', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="v">
          <mh-option value="a">A</mh-option>
          <mh-option value="b">B</mh-option>
          <mh-option value="c">C</mh-option>
        </mh-iterator>`,
      );

      getNextButton(el)?.click();
      await el.updateComplete;

      expect(el.value).toBe('b');
    });

    it('selects the previous value when the previous button is clicked', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="w">
          <mh-option value="a">A</mh-option>
          <mh-option
            value="b"
            selected
            >B</mh-option
          >
          <mh-option value="c">C</mh-option>
        </mh-iterator>`,
      );

      getPreviousButton(el)?.click();
      await el.updateComplete;

      expect(el.value).toBe('a');
    });

    it('does not change the value when the next button is clicked on the last option', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="x">
          <mh-option value="a">A</mh-option>
          <mh-option
            value="b"
            selected
            >B</mh-option
          >
        </mh-iterator>`,
      );

      await getNextButton(el)?.updateComplete;
      getNextButton(el)?.click();
      await el.updateComplete;

      expect(el.value).toBe('b');
    });
  });

  describe('mh-activate-selection', () => {
    it('is emitted with the current value when the selection is clicked', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator
          name="y"
          interactive-selection
        >
          <mh-option value="a">A</mh-option>
          <mh-option
            value="b"
            selected
            >B</mh-option
          >
        </mh-iterator>`,
      );

      const activated = oneEvent(
        el,
        'mh-activate-selection',
      ) as Promise<ActivateSelectionEvent>;
      getSelection(el)?.dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      );
      const event = await activated;

      expect(event.value).toBe('b');
    });

    it('is emitted when Enter is pressed on the selection', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator
          name="z"
          interactive-selection
        >
          <mh-option
            value="a"
            selected
            >A</mh-option
          >
        </mh-iterator>`,
      );

      const activated = oneEvent(
        el,
        'mh-activate-selection',
      ) as Promise<ActivateSelectionEvent>;
      getSelection(el)?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
      const event = await activated;

      expect(event.value).toBe('a');
    });

    it('is not emitted when another key is pressed on the selection', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator
          name="aa"
          interactive-selection
        >
          <mh-option value="a">A</mh-option>
        </mh-iterator>`,
      );
      const activateHandler = vi.fn();

      el.addEventListener('mh-activate-selection', activateHandler);
      getSelection(el)?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
      );

      expect(activateHandler).not.toHaveBeenCalled();
    });
  });

  describe('form association', () => {
    it('sets form value when the value property changes', async () => {
      const el = await fixture<Iterator>(
        html`<mh-iterator name="ab">
          <mh-option value="a">A</mh-option>
          <mh-option value="b">B</mh-option>
        </mh-iterator>`,
      );
      const { setFormValue } = getInternalsMock(el);

      el.value = 'b';
      await el.updateComplete;

      expect(setFormValue).toHaveBeenCalledWith('b');
    });

    describe('form reset', () => {
      it('restores value to the initial selected option after user changes it', async () => {
        const el = await fixture<Iterator>(
          html`<mh-iterator name="ac">
            <mh-option
              value="a"
              selected
              >A</mh-option
            >
            <mh-option value="b">B</mh-option>
          </mh-iterator>`,
        );
        el.value = 'b';
        await el.updateComplete;

        el.formResetCallback();
        await el.updateComplete;

        expect(el.value).toBe('a');
      });

      it('restores value to the default first option when none was initially selected', async () => {
        const el = await fixture<Iterator>(
          html`<mh-iterator name="ad">
            <mh-option value="a">A</mh-option>
            <mh-option value="b">B</mh-option>
          </mh-iterator>`,
        );
        el.value = 'b';
        await el.updateComplete;

        el.formResetCallback();
        await el.updateComplete;

        expect(el.value).toBe('a');
      });

      it('restores form value to the initial value on reset', async () => {
        const el = await fixture<Iterator>(
          html`<mh-iterator name="ae">
            <mh-option
              value="a"
              selected
              >A</mh-option
            >
            <mh-option value="b">B</mh-option>
          </mh-iterator>`,
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
