import { expect } from '@open-wc/testing';

export const assertAccessibility = (el: Element) => {
  document.body.appendChild(el);
  return expect(el).to.be.accessible();
};

export const textContent = (el: Element) =>
  el.shadowRoot
    ? Array.from(el.shadowRoot.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent)
        .join('')
        .trim()
    : '';

export const adoptedStylesheet = (el: Element) =>
  el.shadowRoot?.querySelector('style')?.textContent ?? '';

export const part = <T extends Element = HTMLElement>(
  name: string,
  el: Element,
) => el.shadowRoot?.querySelector<T>(`[part="${name}"]`) ?? null;

export const defaultSlot = (el: Element) =>
  el.shadowRoot?.querySelector<HTMLSlotElement>(`slot:not([name])`) ?? null;

export const slot = (name: string, el: Element) =>
  el.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name=${name}]`) ?? null;
