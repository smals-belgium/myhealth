/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable max-lines-per-function */
import { polyfillToggleEvent } from './toggle-event.polyfill';

// AI slop

const dispatchToggle = (
  details: HTMLDetailsElement,
  oldState: 'open' | 'closed',
) => {
  const newState = details.open ? 'open' : 'closed';
  if (oldState === newState) return;

  details.dispatchEvent(
    new ToggleEvent('toggle', { oldState, newState, source: null }),
  );
};

/**
 * Jsdom does not implement the native `<details>`/`<summary>` disclosure
 * behaviour: clicking the summary neither toggles the `open` attribute nor
 * fires a `toggle` event, and changing the `open` state programmatically
 * (e.g. via a Lit re-render flipping the reflected attribute) doesn't fire a
 * `toggle` event either (see https://github.com/jsdom/jsdom/issues/3541).
 *
 * This patches:
 *  - the `open` IDL property on `HTMLDetailsElement`, so setting it directly
 *    fires `toggle` when the state actually changes;
 *  - `Element.prototype.toggleAttribute`, which is what Lit's boolean
 *    attribute bindings (`?open=${...}`) use under the hood, so a re-render
 *    that flips the `open` attribute also fires `toggle`;
 *  - `Element.prototype.attachShadow`, so every shadow root gets a
 *    capturing `click` listener that toggles `open` when a `<summary>` is
 *    activated, like the browser does.
 */
export const polyfillDetails = () => {
  polyfillToggleEvent();

  const proto = HTMLDetailsElement.prototype as {
    __mhDetailsPolyfilled?: boolean;
  };
  if (proto.__mhDetailsPolyfilled) return;
  proto.__mhDetailsPolyfilled = true;

  const openDescriptor = Object.getOwnPropertyDescriptor(
    HTMLDetailsElement.prototype,
    'open',
  );
  Object.defineProperty(HTMLDetailsElement.prototype, 'open', {
    configurable: true,
    enumerable: openDescriptor?.enumerable,
    get: openDescriptor?.get,
    set(this: HTMLDetailsElement, value: boolean) {
      const oldState = this.open ? 'open' : 'closed';
      openDescriptor?.set?.call(this, value);
      dispatchToggle(this, oldState);
    },
  });

  const { toggleAttribute } = Element.prototype;
  Element.prototype.toggleAttribute = function (
    this: Element,
    name: string,
    force?: boolean,
  ) {
    if (name !== 'open' || !(this instanceof HTMLDetailsElement))
      return toggleAttribute.call(this, name, force);

    const oldState = this.open ? 'open' : 'closed';
    const result = toggleAttribute.call(this, name, force);
    dispatchToggle(this, oldState);
    return result;
  };

  const { attachShadow } = Element.prototype;
  Element.prototype.attachShadow = function (init: ShadowRootInit) {
    const root = attachShadow.call(this, init);

    root.addEventListener(
      'click',
      event => {
        const summary = (event.target as Element | null)?.closest?.('summary');
        const details = summary?.parentElement;

        if (
          !summary ||
          !(details instanceof HTMLDetailsElement) ||
          details.querySelector('summary') !== summary
        )
          return;

        details.open = !details.open;
      },
      true,
    );

    return root;
  };
};
