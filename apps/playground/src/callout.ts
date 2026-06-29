import type { Callout } from '@myhealth/design-kit';

const callout = (id: string) => document.querySelector<Callout>(`#${id}`);

const wireOpen = (triggerId: string, calloutId: string) => {
  document
    .querySelector(`#${triggerId}`)
    ?.addEventListener('click', () => callout(calloutId)?.open());

  callout(calloutId)?.addEventListener('mh-callout-after-closed', event => {
    console.log(`"${calloutId}" closed with: "${event.result ?? 'dismissed'}"`);
  });
};

wireOpen('open-demo-color', 'demo-color');
wireOpen('open-demo-white', 'demo-white');
wireOpen('open-demo-expansion', 'demo-expansion');
