export type ToggleTransition = {
  oldState: 'open' | 'closed';
  newState: 'open' | 'closed';
};

export type ToggleEventInit = ToggleTransition & {
  source: Element | null;
  type: 'beforetoggle' | 'toggle';
};

export const polyfillToggleEvent = () => {
  class MockToggleEvent extends Event {
    oldState: string;
    newState: string;
    source: Element | null;

    constructor(
      type: string,
      init?: EventInit & {
        oldState?: string;
        newState?: string;
        source?: Element | null;
      },
    ) {
      super(type, init);

      this.oldState = init?.oldState ?? 'closed';
      this.newState = init?.newState ?? 'open';
      this.source = init?.source ?? null;
    }
  }

  window.ToggleEvent ??= MockToggleEvent;
};
