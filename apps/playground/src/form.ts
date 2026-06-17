document.querySelector('#form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();

  console.log([...new FormData(event.target as HTMLFormElement).entries()]);
});

document.querySelector('#form')?.addEventListener('reset', (event) => {
  console.log([...new FormData(event.target as HTMLFormElement).entries()]);
});
