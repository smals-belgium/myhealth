import fs from 'node:fs';
import path from 'node:path';

function parseTokens(source) {
  const tokenRegex = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  const tokens = [];
  let match = tokenRegex.exec(source);

  while (match) {
    tokens.push({ name: match[1], value: match[2].trim() });
    match = tokenRegex.exec(source);
  }

  return tokens;
}

export default function () {
  const rootDir = path.join(import.meta.dirname, '..', '..', '..', '..');
  const colorDir = path.join(
    rootDir,
    'packages',
    'design-kit',
    'src',
    'theme',
    'color',
  );

  if (!fs.existsSync(colorDir)) {
    return { generatedAt: new Date().toISOString(), groups: [] };
  }

  const groups = fs
    .readdirSync(colorDir)
    .filter((fileName) => fileName.endsWith('.css'))
    .sort()
    .map((fileName) => {
      const source = fs.readFileSync(path.join(colorDir, fileName), 'utf8');
      return {
        name: fileName.replace('.css', ''),
        fileName,
        tokens: parseTokens(source),
      };
    });

  return {
    generatedAt: new Date().toISOString(),
    groups,
  };
}
