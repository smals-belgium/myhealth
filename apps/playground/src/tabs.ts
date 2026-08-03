import type { TabGroup } from '@myhealth/design-kit';

const programmaticGroup =
  document.querySelector<TabGroup>('#programmaticGroup');
const eventLog = document.querySelector<HTMLParagraphElement>('#eventLog');

document.querySelector('#selectFirst')?.addEventListener('click', () => {
  if (!programmaticGroup) return;
  programmaticGroup.selectedIndex = 0;
});

document.querySelector('#selectLast')?.addEventListener('click', () => {
  if (!programmaticGroup) return;
  programmaticGroup.selectedIndex = 2;
});

programmaticGroup?.addEventListener('mh-tab-group-selected-change', event => {
  if (!eventLog) return;
  eventLog.textContent = `Selected tab index: ${event.index.toString()}`;
});

const linkGroup = document.querySelector<TabGroup>('#linkGroup');
const linkEventLog =
  document.querySelector<HTMLParagraphElement>('#linkEventLog');

linkGroup?.addEventListener('mh-tab-link-navigate', event => {
  if (!linkEventLog) return;
  // Prevent the actual navigation so the demo page stays put; just log it.
  event.preventDefault();
  linkEventLog.textContent = `Would navigate to: ${event.href}`;
});
