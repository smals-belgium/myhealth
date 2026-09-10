import { LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import { cssStateReflect } from '../../core/css';

import styles from './option.css?inline';

/**
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/option
 * @status stable
 * @since 1.0
 *
 * @cssproperty [--mh-option__size-border-radius=var(--mh-border-radius)] - The border radius of the option item.
 * @cssproperty [--mh-option__color-fill__hover=var(--mh-color-brand-fill-quiet)] - The background color on hover.
 * @cssproperty [--mh-option__color-fill__selected=var(--mh-color-brand-fill-quieter)] - The background color when selected.
 * @cssproperty [--mh-option__color-type__disabled=var(--mh-color-neutral-type-loud)] - The text color when disabled.
 */
@customElement('mh-option')
export class Option extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  /**
   * The option's value. When selected, the containing form control will receive this value. The value must be unique
   * from other options in the same group. Values may not contain spaces, as spaces are used as delimiters when listing
   * multiple values.
   */
  @property({ reflect: true }) value = '';

  /** Draws the option in a disabled state, preventing selection. */
  @property({ type: Boolean }) disabled = false;

  @property({ type: Boolean }) selected = false;

  /** Override to track changes. */
  @property({ reflect: true }) override role = 'option';

  override connectedCallback() {
    super.connectedCallback();
    this.addController(cssStateReflect(this, ['disabled', 'selected']));
  }

  protected override update(changes: PropertyValues): void {
    super.update(changes);

    if (changes.has('selected'))
      this.setAttribute('aria-selected', this.selected ? 'true' : 'false');

    if (changes.has('selected') || changes.has('disabled'))
      if (this.disabled) this.removeAttribute('tabindex');
      else this.setAttribute('tabindex', this.selected ? '0' : '-1');

    if (changes.has('role') && this.role !== 'option')
      ['tabindex', 'aria-selected'].forEach(attr => this.removeAttribute(attr));
  }

  override render() {
    return html`
      <slot
        part="start"
        name="start"
      ></slot>
      <slot part="label"></slot>
      <slot
        part="end"
        name="end"
      ></slot>
    `;
  }
}
