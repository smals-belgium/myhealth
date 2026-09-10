export const polyfillDialog = () => {
  const proto = HTMLDialogElement.prototype;

  if (!proto.showModal)
    proto.showModal = function showModal() {
      this.open = true;
    };

  if (!proto.show)
    proto.show = function show() {
      this.open = true;
    };

  if (!proto.close)
    proto.close = function close(returnValue?: string) {
      if (!this.open) return;
      this.open = false;
      if (typeof returnValue === 'string') this.returnValue = returnValue;
      this.dispatchEvent(new Event('cancel'));
      this.dispatchEvent(new Event('close'));
    };
};
