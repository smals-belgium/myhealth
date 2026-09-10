/** Moves [slot="tab-label"] light-DOM nodes into named staging spans so they can be slotted across shadow roots. */
export class LabelStaging {
  readonly #map = new Map<Element, HTMLSpanElement>();
  readonly #host: Element;

  constructor(host: Element) {
    this.#host = host;
  }

  sync(tabs: Element[]) {
    const current = new Set(tabs);

    this.#map.forEach((span, tab) => {
      if (current.has(tab)) return;
      span.remove();
      this.#map.delete(tab);
    });

    tabs.forEach((tab, index) => {
      let span = this.#map.get(tab);
      // Null after the first sync — the node is already inside the staging span.
      const newNode = tab.querySelector(':scope > [slot="tab-label"]');

      if (newNode) {
        if (!span) {
          span = document.createElement('span');
          this.#host.appendChild(span);
          this.#map.set(tab, span);
        }
        if (span.firstChild !== newNode) span.replaceChildren(newNode);
      } else if (!span) return;

      span.slot = `tab-label-${index.toString()}`;
    });
  }
}
