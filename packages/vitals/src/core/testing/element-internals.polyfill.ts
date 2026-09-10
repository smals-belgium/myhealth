type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Just making sure that JSDOM tests don't explode when formAttached components are used.
 * We won't re-implement the whole form association, which would be complex and brittle.
 */
export const polyfillElementInternals = () => {
  ElementInternals.prototype.setFormValue ??= () => undefined;
};

/**
 * JSDOM already implements `attachInternals()`, but the returned value is not fully compliant.
 * For one, there is never a form instance attached and we need that for all of our formAttached components.
 */
export const polyfillAttachInternals = () => {
  polyfillElementInternals();

  const original = HTMLElement.prototype.attachInternals;

  HTMLElement.prototype.attachInternals = function attachInternals() {
    const getForm = () => this.closest('form');
    const internalsInstance = original.call(this) as Writable<ElementInternals>;

    Object.defineProperty(internalsInstance, 'form', {
      configurable: true,
      enumerable: true,
      get() {
        return getForm();
      },
    });

    return internalsInstance;
  };
};
