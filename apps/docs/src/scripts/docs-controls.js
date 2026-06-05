/**
 * Interactive controls for the docs component canvas.
 *
 * Listens for change/input events on `.property-input` elements and
 * sets the corresponding property on the target web component.
 * Also keeps a live code snippet in sync.
 */

const STATUS_TIMEOUT = 1500;

/** @param {HTMLElement} target */
function buildSnippet(target) {
  const tag = target.tagName.toLowerCase();
  const section = target.closest('.element-section');
  if (!section) return;

  const inputs = section.querySelectorAll('.property-input');
  const attrs = [];

  for (const input of inputs) {
    const prop = input.dataset.property;
    const kind = input.dataset.kind;
    const defaultValue = input.dataset.defaultValue ?? '';

    let value;
    if (kind === 'boolean') {
      value = input.checked;
      if (!value) continue; // omit false booleans
      attrs.push(prop);
      continue;
    } else {
      value = input.value;
    }

    if (!value || value === defaultValue) continue;
    attrs.push(`${prop}="${value}"`);
  }

  const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';

  // Determine slot content from the current preview
  const inner = target.textContent?.trim() || '';
  const snippet = inner
    ? `<${tag}${attrStr}>${inner}</${tag}>`
    : `<${tag}${attrStr}></${tag}>`;

  const codeEl = section.querySelector('.snippet-code');
  if (codeEl) {
    codeEl.textContent = snippet;
  }
}

/** @param {HTMLElement} input */
function applyProperty(input) {
  const targetId = input.dataset.target;
  const prop = input.dataset.property;
  const kind = input.dataset.kind;
  if (!targetId || !prop) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  if (kind === 'boolean') {
    target[prop] = input.checked;
  } else if (kind === 'number') {
    target[prop] = Number(input.value);
  } else {
    const value = input.value;
    target[prop] = value || undefined;
  }

  buildSnippet(target);
  announceChange(prop, kind === 'boolean' ? input.checked : input.value);
}

function announceChange(prop, value) {
  const region = document.getElementById('a11y-status');
  if (!region) return;
  region.textContent = `${prop} changed to ${value}`;
  clearTimeout(region._timer);
  region._timer = setTimeout(() => {
    region.textContent = '';
  }, STATUS_TIMEOUT);
}

// Bind all controls
document.addEventListener('change', (e) => {
  if (e.target.classList?.contains('property-input')) {
    applyProperty(e.target);
  }
});

document.addEventListener('input', (e) => {
  if (
    e.target.classList?.contains('property-input') &&
    (e.target.dataset.kind === 'text' || e.target.dataset.kind === 'number')
  ) {
    applyProperty(e.target);
  }
});

// Build initial snippets for all previews on page load
document.querySelectorAll('.element-section').forEach((section) => {
  const target =
    section.querySelector('.canvas-inner > [id^="preview-"]') ||
    (() => {
      const id = section.querySelector('.property-input')?.dataset?.target;
      return id ? document.getElementById(id) : null;
    })();
  if (target) buildSnippet(target);
});
