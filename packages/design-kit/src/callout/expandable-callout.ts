import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { CalloutBase } from './base';
import { CalloutExpandedChangedEvent } from './callout-expanded-changed.event';
import expandable from './expandable-callout.css?inline';

/**
 * @summary Expandable callouts are inline banners that disclose their content on demand. Built on the native
 *  `<details>` element, they show a fixed icon for their variant, a title, and a chevron; activating the header
 *  expands or collapses the description and optional actions.
 * @documentation https://github.com/smals-belgium/myhealth-storybook-design-kit/docs/components/expandable-callout
 * @status stable
 * @since 1.0
 *
 * @dependency mh-icon
 *
 * @event mh-callout-after-opened - Emitted after the callout has opened.
 * @event mh-callout-after-closed - Emitted after the callout has closed. The `result` property carries the optional close value.
 * @event mh-callout-expanded-changed - Emitted when the callout is expanded or collapsed. The `expanded` property carries the new state.
 *
 * @slot title - The callout's title, shown next to the icon. Activating it toggles the callout.
 * @slot description - The callout's descriptive content, shown below the title when expanded.
 * @slot actions - The callout's actions, typically buttons. Add the `callout-close` attribute to any element here to
 *  close the callout when it is activated; its value is forwarded as the close result.
 *
 * @csspart icon - The variant icon at the start of the callout.
 * @csspart header - The `<summary>` toggle that wraps the icon, title, and chevron.
 * @csspart title - The container for the `title` slot.
 * @csspart toggle - The chevron icon shown at the end of the header.
 * @csspart region - The collapsible region that wraps the description and actions.
 * @csspart content - The inner wrapper that holds the description and actions.
 * @csspart description - The container for the `description` slot.
 * @csspart actions - The container that wraps the `actions` slot.
 *
 * @cssproperty [--mh-callout__spacing=var(--mh-space-m)] - The amount of space around and between sections of the callout.
 */
@customElement('mh-expandable-callout')
export class ExpandableCallout extends CalloutBase {
  static override readonly styles = [
    ...CalloutBase.styles,
    unsafeCSS(expandable),
  ];

  /** Whether the callout is expanded. */
  @property({ type: Boolean, reflect: true }) expanded = false;

  #onToggle = (event: Event) => {
    const { open } = event.target as HTMLDetailsElement;
    if (open === this.expanded) return;

    this.expanded = open;
    this.dispatchEvent(new CalloutExpandedChangedEvent(this.expanded));
  };

  override render() {
    return html`
      <details
        ?open=${this.expanded}
        @toggle=${this.#onToggle}
      >
        <summary part="header">
          ${this.renderIcon()}
          <span
            part="title"
            id="title"
          >
            <slot name="title"></slot>
          </span>
          <mh-icon
            part="toggle"
            name="keyboard_arrow_down"
            aria-hidden="true"
          ></mh-icon>
        </summary>

        <div
          part="region"
          aria-labelledby="title"
          @click=${this.onCloseTrigger}
        >
          <div part="content">
            <slot
              name="description"
              part="description"
            ></slot>
            <div part="actions">
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </details>
    `;
  }
}
