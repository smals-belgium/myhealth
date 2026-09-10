import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { ErrorEvent } from '../core/event';
import { LocalizeController } from '../core/i18n';

import appearance from './skeleton.appearance.css?inline';
import styles from './skeleton.css?inline';

/** Determines which animation the skeleton uses while content loads. */
export type SkeletonAnimation = 'none' | 'sheen' | 'pulse';

/** The maximum number of rows a single skeleton will render. Higher `count` values are clamped to this. */
export const SKELETON_MAX_COUNT = 25;

/** The default number of rows a skeleton will render. */
export const DEFAULT_SKELETON_COUNT = 7;

/**
 * @summary Skeletons show placeholder shapes where content will appear once it finishes loading, reducing perceived
 *  wait time and preventing layout shift. Size a row by setting `--mh-skeleton__size-height` and the element's `width`, and
 *  render several rows at once with the `count` attribute.
 *
 *  A single skeleton exposes one loading status to assistive technology, so a block of rows is announced once without
 *  needing an extra labelled wrapper.
 * @documentation https://smals-belgium.github.io/shared-myhealth/components/skeleton
 * @status stable
 * @since 1.0
 *
 * @csspart indicator - A skeleton row, responsible for its color and animation. One is rendered per `count`.
 *
 * @cssproperty --mh-skeleton__color - The base color of the skeleton.
 * @cssproperty --mh-skeleton__color-sheen - The sheen color shown while the skeleton is in its loading state.
 * @cssproperty --mh-skeleton__size-border-radius - The border radius of the skeleton's rows.
 * @cssproperty --mh-skeleton__size-height - The height of a single skeleton row.
 * @cssproperty --mh-skeleton__size-gap - The gap between skeleton rows.
 */
@customElement('mh-skeleton')
export class Skeleton extends LitElement {
  static override readonly styles = [styles, appearance].map(unsafeCSS);

  protected readonly localize = new LocalizeController(this);

  /** Determines which animation the skeleton will use. */
  @property({ reflect: true }) animation: SkeletonAnimation = 'sheen';

  /** The number of skeleton rows to render. Clamped to a maximum of {@link SKELETON_MAX_COUNT} and defaulted to {@link DEFAULT_SKELETON_COUNT}. */
  @property({ type: Number, reflect: true }) count = DEFAULT_SKELETON_COUNT;

  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-busy', 'true');
  }

  override update(props: PropertyValues<this>) {
    super.update(props);
    this.setAttribute('aria-label', this.localize.term('loading'));

    if (props.has('count') && this.count > SKELETON_MAX_COUNT)
      this.dispatchEvent(
        new ErrorEvent(
          `<mh-skeleton>: "count" of ${String(this.count)} exceeds the maximum of ${String(SKELETON_MAX_COUNT)}; rendering ${String(SKELETON_MAX_COUNT)} rows instead.`,
        ),
      );

    if (props.has('count') && this.count < 0)
      this.dispatchEvent(
        new ErrorEvent(
          `<mh-skeleton>: "count" must be a non-negative number, got ${String(this.count)}; rendering 0 rows instead.`,
        ),
      );
  }

  protected override render() {
    const rows = Math.min(
      SKELETON_MAX_COUNT,
      Math.max(0, Math.floor(this.count)),
    );
    return html`${Array.from(
      { length: rows },
      () => html`<div part="indicator"></div>`,
    )}`;
  }
}
