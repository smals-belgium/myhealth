import type { Dialog } from '@myhealth/design-kit';

import('@myhealth/design-kit');

const dialog = (id: string) => document.querySelector<Dialog>(`#${id}`);

const wireOpen = (triggerId: string, dialogId: string) =>
  document
    .querySelector(`#${triggerId}`)
    ?.addEventListener('click', () => dialog(dialogId)?.open());

const showResult = (dialogId: string, resultId: string) => {
  const target = document.querySelector(`#${resultId}`);

  dialog(dialogId)?.addEventListener('mh-after-closed', event => {
    if (target)
      target.textContent = `closed with: "${event.result ?? 'dismissed'}"`;
  });
};

wireOpen('openBasic', 'basicDialog');
showResult('basicDialog', 'basicResult');

wireOpen('openPersistent', 'persistentDialog');
showResult('persistentDialog', 'persistentResult');

wireOpen('openScrollable', 'scrollableDialog');
wireOpen('openFullscreen', 'fullscreenDialog');
wireOpen('openHeaderOnly', 'headerOnlyDialog');

wireOpen('openFirst', 'firstDialog');
wireOpen('openSecond', 'secondDialog');
