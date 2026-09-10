const getNodes = (el: Element) => {
  if (el.shadowRoot) return Array.from(el.shadowRoot.childNodes);
  if ('assignedNodes' in el) return (el as HTMLSlotElement).assignedNodes();
  return Array.from(el.childNodes);
};

export const textContent = (el: Element) =>
  getNodes(el)
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent)
    .join('')
    .trim();

export const adoptedStylesheet = (el: Element) =>
  Array.from(el.shadowRoot?.querySelectorAll('style') ?? [])
    .map(styleEl => styleEl.textContent)
    .join('\n');

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- handing down to wrapped function
export const part = <T extends Element = HTMLElement>(
  name: string,
  el: Element,
) => el.shadowRoot?.querySelector<T>(`[part="${name}"]`) ?? null;

export const defaultSlot = (el: Element) =>
  el.shadowRoot?.querySelector<HTMLSlotElement>(`slot:not([name])`) ?? null;

export const slot = (name: string, el: Element) =>
  el.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name=${name}]`) ?? null;
