const isSlot = (el: unknown): el is HTMLSlotElement =>
  el !== null && typeof el === 'object' && 'assignedElements' in el;

export const slotContentDirective = ({ target }: Event) => {
  if (isSlot(target))
    target.toggleAttribute(
      'mh-has-slotted-content',
      target.assignedElements().length > 0,
    );
  else
    throw new Error(
      'Framework error: slotContentDirective used on wrong element',
    );
};
