import { expect } from '@open-wc/testing';

export const assertAccessibility = (el: Element) => {
  document.body.appendChild(el);
  return expect(el).to.be.accessible();
};
