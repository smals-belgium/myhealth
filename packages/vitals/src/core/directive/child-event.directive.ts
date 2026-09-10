type EventPayload = {
  target: HTMLElement;
  value: string | null;
};

type ChildEventDirective = {
  name: string;
  onEvent: (event: EventPayload) => void;
};

const isChildWith =
  (name: string) =>
  (el: unknown): el is HTMLElement =>
    el instanceof HTMLElement &&
    (el.hasAttribute(name) || el.tagName.toLowerCase() === name.toLowerCase());

/**
 * If it's an attribute directive, get that attribute's value.
 * If it's a component directive, look for a `value` attribute and read that.
 * Return `null` if neither condition is met.
 */
const getValue = (el: HTMLElement, name: string) =>
  el.getAttribute(el.hasAttribute(name) ? name : 'value') ?? null;

export const childEventDirective =
  ({ name, onEvent }: ChildEventDirective) =>
  (event: MouseEvent) => {
    const target = event.composedPath().find(isChildWith(name));
    if (target) onEvent({ target, value: getValue(target, name) });
  };
