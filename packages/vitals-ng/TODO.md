# vitals-ng todo's

## Core

- [ ] Shared router-link helper (`packages/vitals-ng/src/core`): a reusable way to resolve Angular Router inputs
      (`routerLink`, `queryParams`, `fragment`, etc.) into a plain `href` string, usable by both `Anchor` (`mh-a`)
      and a future tab-group router bridge. Extract this once a second consumer needs it instead of duplicating
      resolution logic.

## Tabs — Router integration (deferred)

Context: `mh-tab-link` (`packages/design-kit/src/tabs/tab-link.ts`) only supports plain `href`/`target`/`rel`/
`download` for now. Full Angular Router integration was descoped from the initial `mh-tab-link` feature and is
tracked here for later.

- [ ] Verify whether stock Angular `RouterLink` can be applied directly to `<mh-a routerLink="...">`. Unlike
      `mh-tab-link` (whose real `<a>` lives in the sibling `mh-tab-group`'s shadow root), `mh-a`'s real anchor lives
      in its own shadow root, so `RouterLink`'s host-level click listener might just work there — this is an
      unverified assumption and should be confirmed with a test before relying on it.
- [ ] If needed, implement the shared router-link helper described above.
- [ ] Implement a `TabGroupRouterLink` directive that:
  - Listens for the `mh-tab-link-navigate` event dispatched by `mh-tab-group`'s host element (cancelable).
  - Calls `preventDefault()` on it and performs the actual navigation via Angular's `Router`, mirroring what
    `RouterLink` does for regular anchors.
  - This bridge is required because click events on the real `<a>` inside `mh-tab-group`'s shadow root do not
    bubble into a sibling `mh-tab-link`'s light DOM, so `RouterLink` cannot listen on `mh-tab-link` directly.
