/** The `aria-live` politeness used to announce a message. */
export type LiveAnnouncerPoliteness = 'polite' | 'assertive';

/**
 * Delay, in milliseconds, between clearing and repopulating the live region. Clearing first guarantees screen readers
 * detect a change even when the same message is announced twice in a row.
 */
const ANNOUNCE_DELAY = 100;

const VISUALLY_HIDDEN =
  'position:absolute;width:1px;height:1px;margin:-1px;border:0;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;';

const isClient = typeof document !== 'undefined';

/**
 * Announces messages to assistive technology through a shared, visually hidden live region appended to the document
 * body.
 *
 * The live region deliberately lives in the light DOM rather than inside a component's shadow root, because `aria-live`
 * regions nested in a shadow root are not reliably announced across screen readers. A single shared region is reused for
 * every announcement, mirroring the approach taken by Angular CDK's `LiveAnnouncer`.
 */
export class LiveAnnouncer {
  #region?: HTMLElement;
  #timer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Create the region up front so it is registered by assistive technology well before the first announcement.
    // A live region only announces content that changes *after* it is already present in the accessibility tree.
    // Module scripts are deferred, so the document body is available by the time this singleton is constructed.
    if (isClient) this.#createRegion();
  }

  /**
   * Announces `message` to assistive technology. The region is cleared first and the text injected a moment later, which
   * forces a content change to be detected even when the same message is announced consecutively.
   */
  announce(message: string, politeness: LiveAnnouncerPoliteness = 'polite') {
    if (!isClient) return;

    const region = this.#ensureRegion();
    region.setAttribute('aria-live', politeness);
    region.textContent = '';

    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => {
      region.textContent = message;
    }, ANNOUNCE_DELAY);
  }

  /** The live region element, if one has been created. Exposed for testing. */
  get region() {
    return this.#region;
  }

  #ensureRegion(): HTMLElement {
    if (this.#region?.isConnected) return this.#region;
    return this.#createRegion();
  }

  #createRegion(): HTMLElement {
    const region = document.createElement('div');
    region.className = 'mh-live-announcer';
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('aria-live', 'polite');
    region.style.cssText = VISUALLY_HIDDEN;
    document.body.appendChild(region);

    this.#region = region;
    return region;
  }
}

/** The shared {@link LiveAnnouncer} instance used across the design kit. */
export const liveAnnouncer = new LiveAnnouncer();
