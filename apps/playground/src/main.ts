import('@myhealth/design-kit');

document.addEventListener('mh-error', event => {
  const { message, error } = event as Event & {
    message: string;
    error?: Error;
  };

  if (error) {
    console.warn(message);
    throw error;
  } else console.error(message);
});
