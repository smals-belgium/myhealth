import fs from 'node:fs';
import path from 'node:path';

/**
 * Extracts a global type map from the CEM manifest.
 *
 * For every member whose `parsedType` contains string literal unions,
 * the original type name becomes a key mapping to an array of values.
 *
 * Example output:
 *   { ButtonVariant: ['brand', 'success', 'warning', 'danger'] }
 *
 * Templates can use: {% for v in typeMap.ButtonVariant %}
 */
export default function () {
  const rootDir = path.join(import.meta.dirname, '..', '..', '..', '..');
  const manifestPath = path.join(
    rootDir,
    'packages',
    'design-kit',
    'custom-elements.json',
  );

  if (!fs.existsSync(manifestPath)) {
    return {};
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const typeMap = {};

  for (const mod of manifest.modules) {
    for (const decl of mod.declarations ?? []) {
      for (const member of decl.members ?? []) {
        const typeName = member.type?.text;
        const parsed = member.parsedType?.text;

        if (!typeName || !parsed) continue;
        if (['string', 'boolean', 'number'].includes(typeName)) continue;
        if (typeMap[typeName]) continue;

        const values = [];
        const regex = /'([^']+)'/g;
        let match = regex.exec(parsed);
        while (match) {
          values.push(match[1]);
          match = regex.exec(parsed);
        }

        if (values.length > 0) {
          typeMap[typeName] = values;
        }
      }

      for (const attr of decl.attributes ?? []) {
        const typeName = attr.type?.text;
        const parsed = attr.parsedType?.text;

        if (!typeName || !parsed) continue;
        if (['string', 'boolean', 'number'].includes(typeName)) continue;
        if (typeMap[typeName]) continue;

        const values = [];
        const regex = /'([^']+)'/g;
        let match = regex.exec(parsed);
        while (match) {
          values.push(match[1]);
          match = regex.exec(parsed);
        }

        if (values.length > 0) {
          typeMap[typeName] = values;
        }
      }
    }
  }

  return typeMap;
}
