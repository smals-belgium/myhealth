import path from 'node:path';

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Brussels',
});

export default function (config) {
  const workspaceRoot = path.join(import.meta.dirname, '..', '..');

  config.addFilter('formatDate', isoString =>
    dateFormatter.format(new Date(isoString)),
  );
  const componentsDist = path.join(workspaceRoot, 'packages', 'vitals', 'dist');

  config.addPassthroughCopy({ [componentsDist]: 'assets/vitals' });
  config.addPassthroughCopy('src/styles');
  config.addPassthroughCopy('src/scripts');

  // vitals's dist build treats `lit` (and its sub-packages) as an
  // external dependency, so its bare `import 'lit'` specifiers only resolve
  // in a bundler-based consumer (Vite, Angular, ...). Docs is a plain static
  // site with no bundler, so we vendor lit's own package folders here and
  // resolve the bare specifiers via an import map (see layout.njk).
  for (const pkg of [
    'lit',
    'lit-html',
    'lit-element',
    '@lit/reactive-element',
  ]) {
    config.addPassthroughCopy({
      [path.join(workspaceRoot, 'node_modules', pkg)]: `assets/vendor/${pkg}`,
    });
  }

  // Rebuild the docs when the vitals build output (including its custom
  // elements manifest and CSS) changes, so a running `serve` reflects
  // vitals edits.
  config.addWatchTarget(componentsDist);

  return {
    // GitHub Pages serves project sites (as opposed to <org>.github.io user/org
    // pages) from a `/<repo-name>/` subpath, so root-relative asset URLs need
    // this prefix. Set via the deploy workflow; defaults to `/` for local dev.
    pathPrefix: process.env.DOCS_PATH_PREFIX || '/',
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: 'dist',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
}
