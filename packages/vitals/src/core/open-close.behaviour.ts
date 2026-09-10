import { LitElement } from 'lit';

export type OpenCloseHost = LitElement & { open: boolean };
export type OpenCloseState = 'open' | 'closed';

/**
 * Reusable behaviour for all components that have an open/closed state.
 */
export const openCloseBehaviour = (host: OpenCloseHost) => {
  const state = (): OpenCloseState => (host.open ? 'open' : 'closed');

  return {
    /**
     * Open or close the component.
     * Pass `force` to set an explicit state.
     * Without an explicit argument, the state will be toggled from its previous value.
     */
    toggle: (force?: boolean) => (host.open = force ?? !host.open),

    /**
     * Handle the original ToggleEvent by
     * - updating the state
     * - propagating the event through the Shadow DOM boundary
     */
    onToggle: (event: ToggleEvent) => {
      host.open = event.newState === 'open';

      host.dispatchEvent(
        new ToggleEvent('toggle', {
          oldState: event.oldState,
          newState: state(),
        }),
      );
    },
  };
};
