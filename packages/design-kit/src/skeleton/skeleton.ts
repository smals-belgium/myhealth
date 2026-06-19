import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { LocalizeController } from '../core/i18n';

import styles from './skeleton.css?inline';

/** Determines which animation effect the skeleton uses while content loads. */
export type SkeletonEffect = 'none' | 'sheen' | 'pulse';

/** The maximum number of rows a single skeleton will render. Higher `count` values are clamped to this. */
export const SKELETON_MAX_COUNT = 25;

/**
 * @summary Skeletons show placeholder shapes where content will appear once it finishes loading, reducing perceived
 *  wait time and preventing layout shift. Size a row by setting `--mh-skeleton-height` and the element's `width`, and
 *  render several rows at once with the `count` attribute.
 *
 *  A single skeleton exposes one loading status to assistive technology, so a block of rows is announced once without
 *  needing an extra labelled wrapper.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/skeleton
 * @status stable
 * @since 1.0
 *
 * @csspart indicator - A skeleton row, responsible for its color and animation. One is rendered per `count`.
 *
 * @cssproperty --mh-skeleton-color - The base color of the skeleton.
 * @cssproperty --mh-skeleton-sheen-color - The sheen color shown while the skeleton is in its loading state.
 * @cssproperty --mh-skeleton-border-radius - The border radius of the skeleton's rows.
 * @cssproperty --mh-skeleton-height - The height of a single skeleton row.
 * @cssproperty --mh-skeleton-gap - The gap between skeleton rows.
 */
@customElement('mh-skeleton')
export class Skeleton extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  private readonly localize = new LocalizeController(this);

  /** Determines which effect the skeleton will use. */
  @property({ reflect: true }) effect: SkeletonEffect = 'none';

  /** The number of skeleton rows to render. Clamped to a maximum of {@link SKELETON_MAX_COUNT}. */
  @property({ type: Number, reflect: true }) count = 1;

  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-busy', 'true');
  }

  override update(props: PropertyValues<this>) {
    super.update(props);
    this.setAttribute('aria-label', this.localize.term('loading'));

    if (props.has('count') && this.count > SKELETON_MAX_COUNT)
      // eslint-disable-next-line no-console
      console.warn(
        `<mh-skeleton>: "count" of ${String(this.count)} exceeds the maximum of ${String(SKELETON_MAX_COUNT)}; rendering ${String(SKELETON_MAX_COUNT)} rows instead.`,
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
