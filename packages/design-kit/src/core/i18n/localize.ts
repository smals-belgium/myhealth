import type {
  LitElement,
  ReactiveController,
  ReactiveControllerHost,
} from 'lit';

import { ErrorEvent } from '../event';
import type { LabelKey } from '../label-key';
import type { Language } from '../language';

import { de } from './de';
import { en } from './en';
import { fr } from './fr';
import { nl } from './nl';

const connectedElements = new Set<HTMLElement>();
const translations: Record<Language, Record<LabelKey, string>> = {
  de,
  en,
  fr,
  nl,
};

let documentLanguage: Language = 'en';

const isSupported = (lang: string): lang is Language =>
  Object.keys(translations).includes(lang);

const invalidateDocumentLanguage = () => {
  const lang = document.documentElement.lang || navigator.language;
  if (isSupported(lang)) documentLanguage = lang;
  else
    document.dispatchEvent(
      new ErrorEvent(`Document language not supported: ${lang}`),
    );
};

const isClient =
  typeof MutationObserver !== 'undefined' &&
  typeof document !== 'undefined' &&
  typeof document.documentElement !== 'undefined';

/** Updates all localized elements that are currently connected */
export const update = () => {
  if (isClient) invalidateDocumentLanguage();

  [...connectedElements.keys()]
    .filter(
      (el): el is LitElement =>
        'requestUpdate' in el && typeof el.requestUpdate === 'function',
    )
    .forEach(el => el.requestUpdate());
};

if (isClient) {
  const documentElementObserver = new MutationObserver(update);
  invalidateDocumentLanguage();

  documentElementObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });
}

update();

/**
 * Localize Reactive Controller for components built with Lit
 *
 * To use this controller, import the class and instantiate it in a custom element constructor:
 *
 * private localize = new LocalizeController(this);
 *
 * This will add the element to the set and make it respond to changes to <html dir|lang> automatically. To make it
 * respond to changes to its own dir|lang properties, make it a property:
 *
 *   @property() dir: string;
 *   @property() lang: string;
 *
 * To use a translation method, call it like this:
 *
 *   ${this.localize.term('term_key_here')}
 *   ${this.localize.date('2021-12-03')}
 *   ${this.localize.number(1000000)}
 */
export class LocalizeController implements ReactiveController {
  readonly #host: ReactiveControllerHost & HTMLElement;

  constructor(host: ReactiveControllerHost & HTMLElement) {
    this.#host = host;
    this.#host.addController(this);
  }

  hostConnected() {
    connectedElements.add(this.#host);
  }

  hostDisconnected() {
    connectedElements.delete(this.#host);
  }

  /**
   * Gets the host element's language as determined by the `lang` attribute. The return value is transformed to
   * lowercase.
   */
  lang() {
    if (this.#host.lang) {
      const lang = this.#host.lang.toLowerCase();
      if (isSupported(lang)) return lang;

      this.#host.dispatchEvent(
        new ErrorEvent(
          `Element language not supported: ${lang}
            on element ${this.#host.tagName};
            falling back to document language: ${documentLanguage}`,
        ),
      );
      return documentLanguage;
    }
    return documentLanguage;
  }

  /** Determines if the specified term exists, optionally checking the fallback translation. */
  exists(key: LabelKey): boolean {
    return Boolean(translations[this.lang()][key]);
  }

  /** Outputs a translated term. */
  term(key: LabelKey): string {
    const label = translations[this.lang()][key];

    if (!label) {
      this.#host.dispatchEvent(
        new ErrorEvent(`No translation found for: ${key}`),
      );
      return key;
    }

    return label;
  }

  /** Outputs a localized date in the specified format. */
  date(
    dateToFormat: Date | string,
    options?: Intl.DateTimeFormatOptions,
  ): string {
    const date = new Date(dateToFormat);
    return new Intl.DateTimeFormat(this.lang(), options).format(date);
  }

  /** Outputs a localized number in the specified format. */
  number(
    numberToFormat: number | string,
    options?: Intl.NumberFormatOptions,
  ): string {
    const number = Number(numberToFormat);
    return isNaN(number)
      ? ''
      : new Intl.NumberFormat(this.lang(), options).format(number);
  }

  /** Outputs a localized time in relative format. */
  relativeTime(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ): string {
    return new Intl.RelativeTimeFormat(this.lang(), options).format(
      value,
      unit,
    );
  }
}
