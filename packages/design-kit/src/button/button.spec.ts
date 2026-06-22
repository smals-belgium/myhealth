import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { assertAccessibility, part } from '../core/testing';

import './button';
import type { ButtonVariant } from './base';
import type { Button } from './button';

const variants: ButtonVariant[] = ['brand', 'success', 'warning', 'danger'];

describe('button', () => {
  const getButton = (el: Element) => el.shadowRoot?.querySelector('button');

  describe('accessibility', () => {
    it(`passes accessibility tests`, async () => {
      await assertAccessibility(
        await fixture(html`<mh-button>click</mh-button>`),
      );
    });

    variants.forEach(variant => {
      it(`is accessible when variant is "${variant}"`, async () => {
        await assertAccessibility(
          await fixture<Button>(
            html`<mh-button variant=${variant}>click</mh-button>`,
          ),
        );
      });
    });

    it(`is accessible when disabled`, async () => {
      await assertAccessibility(
        await fixture<Button>(html`<mh-button disabled>click</mh-button>`),
      );
    });
  });

  describe('title', () => {
    it(`has default empty title`, async () => {
      const el = await fixture<Button>(html`<mh-button>click</mh-button>`);
      expect(el.title).toBe('');
      expect(getButton(el)?.getAttribute('title')).toBe('');
    });

    it(`reflects title as a button attribute`, async () => {
      const el = await fixture<Button>(
        html`<mh-button title="hello">click</mh-button>`,
      );

      expect(el.title).toBe('hello');
      expect(getButton(el)?.getAttribute('title')).toBe('hello');
    });
  });

  describe('variant', () => {
    it(`has default variant "brand"`, async () => {
      const el = await fixture<Button>(html`<mh-button>click</mh-button>`);
      expect(el.variant).toBe('brand');
      expect(el.getAttribute('variant')).toBe('brand');
    });

    it(`reflects variant to an attribute`, async () => {
      const el = await fixture<Button>(
        html`<mh-button variant="danger">click</mh-button>`,
      );

      expect(el.variant).toBe('danger');
      expect(el.getAttribute('variant')).toBe('danger');
    });
  });

  describe('appearance', () => {
    it(`has default appearance "filled"`, async () => {
      const el = await fixture<Button>(html`<mh-button>click</mh-button>`);
      expect(el.appearance).toBe('filled');
      expect(el.getAttribute('appearance')).toBe('filled');
    });

    it(`reflects appearance to an attribute`, async () => {
      const el = await fixture<Button>(
        html`<mh-button appearance="link">click</mh-button>`,
      );

      expect(el.appearance).toBe('link');
      expect(el.getAttribute('appearance')).toBe('link');
    });
  });

  describe('size', () => {
    it(`has default size "m"`, async () => {
      const el = await fixture<Button>(html`<mh-button>click</mh-button>`);
      expect(el.size).toBe('m');
      expect(el.getAttribute('size')).toBe('m');
    });

    it(`reflects size to an attribute`, async () => {
      const el = await fixture<Button>(
        html`<mh-button size="s">click</mh-button>`,
      );

      expect(el.size).toBe('s');
      expect(el.getAttribute('size')).toBe('s');
    });
  });

  describe('disabled', () => {
    it(`is not disabled by default`, async () => {
      const el = await fixture<Button>(html`<mh-button>click</mh-button>`);
      expect(el.disabled).toBe(false);
      expect(getButton(el)?.getAttribute('disabled')).toBeNull();
    });

    it(`reflects disabled as a boolean button attribute`, async () => {
      const el = await fixture<Button>(
        html`<mh-button disabled>click</mh-button>`,
      );

      expect(el.disabled).toBe(true);
      expect(getButton(el)?.getAttribute('disabled')).toBe('');
    });

    it(`doesn't emit a click event when disabled`, async () => {
      const el = await fixture<Button>(
        html`<mh-button disabled>click</mh-button>`,
      );
      const clickHandler = vi.fn();

      el.addEventListener('click', clickHandler);
      el.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });
  });

  describe('type', () => {
    it(`has default type "button"`, async () => {
      const el = await fixture<Button>(html`<mh-button>click</mh-button>`);
      expect(el.type).toBe('button');
      expect(getButton(el)?.getAttribute('type')).toBe('button');
    });

    it(`reflects type as a button attribute`, async () => {
      const el = await fixture<Button>(
        html`<mh-button type="reset">click</mh-button>`,
      );

      expect(el.type).toBe('reset');
      expect(getButton(el)?.getAttribute('type')).toBe('reset');
    });
  });

  describe('loading', () => {
    it(`has default loading state "false"`, async () => {
      const el = await fixture<Button>(html`<mh-button>click</mh-button>`);
      expect(el.loading).toBe(false);
      expect(el.getAttribute('loading')).toBeNull();
      expect(part('spinner', el)).toBeNull();
    });

    it(`reflects loading state as a boolean attribute`, async () => {
      const el = await fixture<Button>(
        html`<mh-button loading>click</mh-button>`,
      );

      expect(el.loading).toBe(true);
      expect(el.getAttribute('loading')).toBe('');
    });

    it(`displays a spinner when loading`, async () => {
      const el = await fixture<Button>(
        html`<mh-button loading>click</mh-button>`,
      );

      expect(part('spinner', el)).not.toBeNull();
    });
  });

  describe('events', () => {
    it(`emits focus and blur when the button is focused and blurred`, async () => {
      const el = await fixture<Button>(html`<mh-button>click</mh-button>`);
      const focusHandler = vi.fn();
      const blurHandler = vi.fn();

      el.addEventListener('focus', focusHandler);
      el.addEventListener('blur', blurHandler);
      el.focus();
      el.blur();

      expect(focusHandler).toHaveBeenCalledTimes(1);
      expect(blurHandler).toHaveBeenCalledTimes(1);
    });

    it(`emits a click event when calling click()`, async () => {
      const el = await fixture<Button>(html`<mh-button>click</mh-button>`);
      const clickHandler = vi.fn();

      el.addEventListener('click', clickHandler);
      el.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);
    });
  });
});
