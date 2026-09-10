import { polyfillDetails } from './details.polyfill';
import { polyfillDialog } from './dialog.polyfill';
import { polyfillAttachInternals } from './element-internals.polyfill';
import { polyfillPopover } from './popover.polyfill';

export const polyfillAll = () => {
  polyfillAttachInternals();
  polyfillDetails();
  polyfillDialog();
  polyfillPopover();
};
