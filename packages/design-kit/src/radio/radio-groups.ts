import type { Radio } from './radio';

/**
 * Manages radio groups in the document.
 * Radio groups are radio inputs with the same `name`.
 * They produce a single form value for that name.
 */
export const radioGroups = {
  groups: new Map<string, Set<Radio>>(),

  /**
   * Add the radio to the group with the same `name`.
   * Create the group if it doesn't exist yet.
   */
  connect(el: Radio) {
    if (!this.groups.has(el.name)) this.groups.set(el.name, new Set());
    this.groups.get(el.name)?.add(el);
  },

  /**
   * Remove the radio from the group it belongs to.
   * If the group is empty, remove that too.
   */
  disconnect(el: Radio) {
    const group = this.groups.get(el.name);
    if (!group) return;

    group.delete(el);
    if (group.size === 0) this.groups.delete(el.name);
  },

  /**
   * Update the form value of the radio group.
   * The radio passed as argument is the one to be selected.
   * All others must be deselected.
   * This is the way.
   *
   * Note: `FormData` _can_ contain multiple entries for the same `name` with different values.
   * e.g. `[['gender', 'm'], ['gender', 'f']]` is totally fine.
   * This is why we need to call `setFormValue` for every single radio in the group, otherwise the previous value
   * will remain there together with the new one.
   */
  updateValue(selectedEl: Radio) {
    this.groups.get(selectedEl.name)?.forEach((radio) => {
      const isSelected = radio === selectedEl;
      const { el, value } = radio;

      if (el) radio.checked = el.checked = isSelected;
      radio.internals.setFormValue(isSelected ? value : null);
    });
  },

  /**
   * Reset the form value for the entire radio group.
   * Note: every radio in the group calls this function since they all implement `formResetCallback`.
   */
  reset(el: Radio, checked: boolean) {
    el.checked = checked;

    if (checked) this.updateValue(el);
    else el.internals.setFormValue(null);
  },
};
