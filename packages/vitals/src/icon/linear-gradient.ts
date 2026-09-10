/* eslint-disable no-magic-numbers -- some math calculations here */
import type { LinearGradient, Stop } from '../core/css';

const gradientId = 'icon-gradient';

const parse = (svg: string) =>
  new DOMParser().parseFromString(svg, 'image/svg+xml');

const toString = (doc: Document) => new XMLSerializer().serializeToString(doc);

const createEl = (doc: Document, type: string) =>
  doc.createElementNS('http://www.w3.org/2000/svg', type);

const createStop =
  (doc: Document) =>
  ({ color, offset }: Stop) => {
    const stop = createEl(doc, 'stop');
    stop.setAttribute('offset', `${String(offset)}%`);
    stop.setAttribute('stop-color', color);
    return stop;
  };

const angleToLine = (degrees: number) => {
  const radians = (degrees * Math.PI) / 180;
  const xCoord = Math.cos(radians);
  const yCoord = Math.sin(radians);

  return {
    x1: (50 - xCoord * 50) / 100,
    y1: (50 - yCoord * 50) / 100,
    x2: (50 + xCoord * 50) / 100,
    y2: (50 + yCoord * 50) / 100,
  };
};

const createGradientDef = (doc: Document, { angle, stops }: LinearGradient) => {
  const gradient = createEl(doc, 'linearGradient');
  const { x1, y1, x2, y2 } = angleToLine(angle);

  gradient.setAttribute('id', gradientId);
  gradient.setAttribute('x1', String(x1));
  gradient.setAttribute('y1', String(y1));
  gradient.setAttribute('x2', String(x2));
  gradient.setAttribute('y2', String(y2));

  gradient.append(...stops.map(createStop(doc)));
  return gradient;
};

export const addLinearGradient = (
  svgText: string,
  gradient: LinearGradient,
) => {
  const doc = parse(svgText);
  const defs = createEl(doc, 'defs');
  defs.appendChild(createGradientDef(doc, gradient));

  const svg = doc.documentElement;
  svg.insertBefore(defs, svg.firstChild);
  svg
    .querySelectorAll('[fill="currentColor"]')
    .forEach(el => el.setAttribute('fill', `url(#${gradientId})`));

  return toString(doc);
};
