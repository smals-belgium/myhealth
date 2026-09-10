import type { LitElement } from 'lit';

export const INTERNALS: unique symbol = Symbol('vitals:internals');

export type VitalElement = LitElement & { [INTERNALS]?: ElementInternals };

export const getInternals = (host: VitalElement) =>
  (host[INTERNALS] ??= host.attachInternals());
