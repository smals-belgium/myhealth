import type { Alert } from '@myhealth/design-kit';

const alert = (id: string) => document.querySelector<Alert>(`#${id}`);

const wireOpen = (triggerId: string, alertId: string) => {
  document
    .querySelector(`#${triggerId}`)
    ?.addEventListener('click', () => alert(alertId)?.open());

  alert(alertId)?.addEventListener('mh-alert-after-closed', event => {
    console.log(`"${alertId}" closed with: "${event.result ?? 'dismissed'}"`);
  });
};

wireOpen('open-demo-color', 'demo-color');
wireOpen('open-demo-white', 'demo-white');
wireOpen('open-demo-expansion', 'demo-expansion');
