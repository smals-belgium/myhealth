import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import './teapot';

describe('teapot', () => {
  describe('accessibility', () => {
    it('passes accessibility tests', async () => {
      const el = await fixture(html`<mh-teapot></mh-teapot>`);
      document.body.appendChild(el);
      // teapot is not a valid ARIA role :)
      expect(el).not.to.be.accessible();
    });

    it('has role="separator"', async () => {
      const el = await fixture(html`<mh-teapot></mh-teapot>`);
      expect(el.getAttribute('role')).to.equal('teapot');
    });
  });
});
