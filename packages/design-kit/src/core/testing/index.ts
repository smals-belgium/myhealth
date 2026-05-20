import { expect } from '@open-wc/testing';

export const assertAccessibility = (el: Element) => {
  document.body.appendChild(el);
  expect(el).to.be.accessible();
};
