import type { LitElement } from 'lit';

import type { Option } from './option';

export type OptionHost = LitElement & {
  open?: boolean;
  placeholder?: string;
  value?: string | null;
};

export const getAllOptions = (host: HTMLElement) =>
  host.querySelectorAll<Option>('mh-option');

export const numOptions = (host: HTMLElement) => getAllOptions(host).length;

export const getOption = (host: HTMLElement, selector: string) =>
  host.querySelector<Option>(`mh-option${selector}`);

export const getOptionAt = (host: HTMLElement, index: number) =>
  getAllOptions(host).item(index);

export const getOptionIndex = (host: HTMLElement, option: Option) =>
  Array.from(getAllOptions(host)).indexOf(option);

export const getSelectedOption = (host: HTMLElement) =>
  getOption(host, '[selected]');

export const getSelectedLabel = (host: OptionHost) =>
  getSelectedOption(host)?.innerText ?? host.placeholder ?? '';

export const getActiveOption = (host: HTMLElement) =>
  getOption(host, ':state(active)') ?? getSelectedOption(host);

export const getActiveIndex = (host: HTMLElement) => {
  const activeOption = getActiveOption(host);
  return activeOption ? getOptionIndex(host, activeOption) : 0;
};
