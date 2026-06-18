import('@myhealth/design-kit');

document.addEventListener('mh-error', event => {
  const e = event as Event & { message: string; error?: Error };

  if (e.error) {
    console.warn(e.message);
    throw e.error;
  } else console.error(e.message);
});
