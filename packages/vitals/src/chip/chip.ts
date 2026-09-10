import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { Variant } from '../core';

import styles from './chip.css?inline';
import variant from './chip.variant.css?inline';

/** The chip's theme variant. */
export type ChipVariant = Variant | 'tertiary';

/**
 * @summary Display chips are compact, non-actionable labels that communicate a status or category.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/chip
 * @status stable
 * @since 1.0
 *
 * @slot - The chip's label.
 * @slot start - An element, such as `<mh-icon>`, placed before the label.
 *
 * @csspart base - The component's base wrapper (`<span>`).
 * @csspart start - The container that wraps the `start` slot.
 * @csspart main - The container that wraps the label.
 *
 * @cssproperty [--mh-chip__size-height=2rem] - The chip's minimum height.
 * @cssproperty [--mh-chip__color-type=var(--mh-color-neutral-type)] - The chip's text color.
 */
@customElement('mh-chip')
export class Chip extends LitElement {
  static override readonly styles = [styles, variant].map(unsafeCSS);

  /** The chip's theme variant. */
  @property({ reflect: true }) variant: ChipVariant = 'neutral';

  override render() {
    return html`
      <span part="base">
        <slot
          name="start"
          part="start"
        ></slot>
        <slot part="main"></slot>
      </span>
    `;
  }
}
