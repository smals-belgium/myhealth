import type { Option } from './option';
import type { Select } from './select';

export const getAllOptions = (host: Select) =>
  host.querySelectorAll<Option>('mh-option');

export const numOptions = (host: Select) => getAllOptions(host).length;

export const getOption = (host: Select, selector: string) =>
  host.querySelector<Option>(`mh-option${selector}`);

export const getOptionAt = (host: Select, index: number) =>
  getAllOptions(host).item(index);

export const getOptionIndex = (host: Select, option: Option) =>
  Array.from(getAllOptions(host)).indexOf(option);

export const getSelectedOption = (host: Select) =>
  getOption(host, '[selected]');

export const getSelectedLabel = (host: Select) =>
  getSelectedOption(host)?.innerText ?? host.placeholder ?? '';

export const getActiveOption = (host: Select) =>
  getOption(host, ':state(active)') ?? getSelectedOption(host);

export const getActiveIndex = (host: Select) => {
  const activeOption = getActiveOption(host);
  return activeOption ? getOptionIndex(host, activeOption) : 0;
};
