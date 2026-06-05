import fs from 'node:fs';
import path from 'node:path';

/** @typedef {'boolean' | 'number' | 'select' | 'text'} ControlKind */

const INTERNAL_MEMBERS = new Set(['click', 'focus', 'blur', 'el']);

/** Parse string literal options from a parsedType string like "'a' | 'b'" */
function parseOptions(parsedTypeText) {
  const regex = /'([^']+)'/g;
  const options = [];
  let match = regex.exec(parsedTypeText);
  while (match) {
    options.push(match[1]);
    match = regex.exec(parsedTypeText);
  }
  return options;
}

function cleanDefault(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

/** @returns {ControlKind} */
function inferControlKind(member) {
  const parsed = member.parsedType?.text ?? '';
  const type = member.type?.text ?? '';
  const def = cleanDefault(member.default);

  if (type === 'boolean' || def === 'true' || def === 'false') return 'boolean';
  if (type === 'number' || /^\d+(?:\.\d+)?$/.test(def)) return 'number';
  if (parsed.includes("'")) return 'select';
  if (type.includes('|') && /'[^']+'/.test(type)) return 'select';

  return 'text';
}

function toProperty(member) {
  if (member.kind !== 'field') return null;
  if (INTERNAL_MEMBERS.has(member.name)) return null;
  if (member.readonly) return null;

  const parsedText = member.parsedType?.text ?? '';
  const options = parseOptions(parsedText);

  return {
    name: member.name,
    attribute: member.attribute ?? member.name,
    kind: inferControlKind(member),
    type: member.type?.text ?? 'unknown',
    parsedType: parsedText,
    defaultValue: cleanDefault(member.default),
    description: member.description ?? '',
    options,
    reflects: member.reflects ?? false,
  };
}

function buildElement(decl) {
  const properties = (decl.members ?? []).map(toProperty).filter(Boolean);

  return {
    tag: decl.tagName,
    className: decl.name,
    description: decl.description ?? '',
    properties,
    slots: (decl.slots ?? []).filter((s) => s.name !== undefined),
    events: (decl.events ?? []).filter((e) => e.description),
    cssParts: decl.cssParts ?? [],
    cssProperties: decl.cssProperties ?? [],
  };
}

export default function () {
  const rootDir = path.join(import.meta.dirname, '..', '..', '..', '..');
  const manifestPath = path.join(
    rootDir,
    'packages',
    'design-kit',
    'custom-elements.json',
  );

  if (!fs.existsSync(manifestPath)) {
    console.warn(
      '[docs] custom-elements.json not found — run generate-manifest first.',
    );
    return { generatedAt: new Date().toISOString(), components: [] };
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // Group declarations by component directory
  const dirMap = new Map();

  for (const mod of manifest.modules) {
    for (const decl of mod.declarations ?? []) {
      if (!decl.tagName) continue;

      // Extract component dir from module path: "src/button/button.ts" → "button"
      const parts = mod.path.split('/');
      const dir = parts.length >= 2 ? parts[1] : parts[0];

      if (!dirMap.has(dir)) {
        dirMap.set(dir, []);
      }
      dirMap.get(dir).push(buildElement(decl));
    }
  }

  const components = [];

  for (const [dir, elements] of dirMap) {
    const summary = elements[0]?.description || `Documentation for ${dir}.`;

    components.push({
      name: dir,
      slug: dir,
      summary,
      elements,
      sourceDir: `packages/design-kit/src/${dir}`,
    });
  }

  components.sort((a, b) => a.name.localeCompare(b.name));

  return {
    generatedAt: new Date().toISOString(),
    components,
  };
}
