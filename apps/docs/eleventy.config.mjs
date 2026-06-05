import path from 'node:path';

export default function (config) {
  const componentsDist = path.join(
    import.meta.dirname,
    '..',
    '..',
    'packages',
    'design-kit',
    'dist',
  );
  const designKitSrc = path.join(
    import.meta.dirname,
    '..',
    '..',
    'packages',
    'design-kit',
    'src',
  );

  config.addPassthroughCopy({
    [componentsDist]: 'assets/design-kit',
    [path.join(designKitSrc, 'my-health.css')]:
      'assets/design-kit/my-health.css',
    [path.join(designKitSrc, 'theme')]: 'assets/design-kit/theme',
  });
  config.addPassthroughCopy('src/styles');
  config.addPassthroughCopy('src/scripts');

  return {
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
