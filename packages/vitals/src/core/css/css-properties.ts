const propName = (el: Element, name: string) =>
  `--${el.tagName.toLowerCase()}__${name}`;

/**
 * Utility functions to read and write custom CSS properties of a Vital element.
 * The keys used as function paremeters should be only the part without the component prefix.
 * e.g. if the CSS variable is `--my-component__color-type`, then the key is `color-type`
 */
export const cssProperties = <K extends string>(el: HTMLElement) => ({
  /** Get the computed property value, so that we can read what a component user has defined through CSS. */
  get(key: K) {
    return getComputedStyle(el)
      .getPropertyValue(propName(el, key))
      .replaceAll(/\s+/gmu, ' ')
      .trim();
  },

  /** Set the value of one of the component's own custom CSS properties. */
  set(key: K, value: string) {
    return el.style.setProperty(propName(el, key), value);
  },

  /** Check whether the component user has defined a value for one the component's custom CSS properties. */
  has(key: K) {
    return this.get(key).length > 0;
  },
});
