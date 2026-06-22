const fs = require('fs').promises;

const postcss = require('postcss');
const cssImport = require('postcss-import');

const from = 'packages/design-kit/src/my-health.css';
const to = 'packages/design-kit/dist/my-health.css';

fs.readFile(from, 'utf8')
  .then(css => postcss().use(cssImport()).process(css, { from }))
  .then(result => fs.writeFile(to, result.css))
  .catch(console.error);
