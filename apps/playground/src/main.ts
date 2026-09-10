import('@smals-belgium-shared/vitals').catch((error: unknown) =>
  console.error('Failed to load vitals', error),
);

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
