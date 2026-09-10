import type { Tooltip } from '@smals-belgium-shared/vitals';

const DEMO_SHOW_DELAY = 1000;

const toggledTooltip = document.querySelector<Tooltip>('#toggledTooltip');
const toggleDisabledBtn =
  document.querySelector<HTMLButtonElement>('#toggleDisabled');
const prog = document.querySelector<Tooltip>('#progTooltip');

toggleDisabledBtn?.addEventListener('click', () => {
  if (!toggledTooltip) return;
  toggledTooltip.disabled = !toggledTooltip.disabled;
  toggleDisabledBtn.textContent = toggledTooltip.disabled
    ? 'Enable tooltip'
    : 'Disable tooltip';
});

document
  .querySelector('#btnShow')
  ?.addEventListener('click', () => prog?.show());
document
  .querySelector('#btnHide')
  ?.addEventListener('click', () => prog?.hide());
document
  .querySelector('#btnToggle')
  ?.addEventListener('click', () => prog?.toggle());
document
  .querySelector('#btnShowDelay')
  ?.addEventListener('click', () => prog?.show(DEMO_SHOW_DELAY));
