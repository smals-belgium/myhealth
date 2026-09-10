import { LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';

/** Shared behavior for the interactive (`<button>`-based) chips. */
export abstract class InteractiveChipBase extends LitElement {
  @query('[part="base"]') el!: HTMLElement;

  /** Whether the chip is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  override readonly focus = () => this.el.focus();
  override readonly blur = () => this.el.blur();
}
