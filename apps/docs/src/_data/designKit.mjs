import fs from 'node:fs';
import path from 'node:path';

export default function () {
  const pkgPath = path.join(
    import.meta.dirname,
    '..',
    '..',
    '..',
    '..',
    'packages',
    'vitals',
    'package.json',
  );
  const { version } = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return { version };
}
