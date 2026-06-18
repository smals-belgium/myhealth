import type { Radio } from './radio';
import { radioGroups } from './radio-groups';

// Minimal mock that satisfies the subset of Radio used by radioGroups.
const makeRadio = (name: string, value: string, checked = false): Radio => {
  const el = { checked } as HTMLInputElement;
  return {
    name,
    value,
    checked,
    el,
    internals: { setFormValue: vi.fn() },
  } as unknown as Radio;
};

beforeEach(() => radioGroups.groups.clear());

describe('radioGroups', () => {
  describe('connect', () => {
    it('creates a new group for an unknown name', () => {
      const radio = makeRadio('g1', 'a');
      radioGroups.connect(radio);

      expect(radioGroups.groups.has('g1')).toBe(true);
      expect(radioGroups.groups.get('g1')?.has(radio)).toBe(true);
    });

    it('adds to an existing group when the name is already known', () => {
      const r1 = makeRadio('g2', 'a');
      const r2 = makeRadio('g2', 'b');
      radioGroups.connect(r1);
      radioGroups.connect(r2);

      expect(radioGroups.groups.get('g2')?.size).toBe(2);
      expect(radioGroups.groups.get('g2')?.has(r1)).toBe(true);
      expect(radioGroups.groups.get('g2')?.has(r2)).toBe(true);
    });

    it('keeps separate groups for different names', () => {
      const r1 = makeRadio('g3a', 'a');
      const r2 = makeRadio('g3b', 'b');
      radioGroups.connect(r1);
      radioGroups.connect(r2);

      expect(radioGroups.groups.get('g3a')?.has(r1)).toBe(true);
      expect(radioGroups.groups.get('g3b')?.has(r2)).toBe(true);
      expect(radioGroups.groups.get('g3a')?.has(r2)).toBe(false);
    });
  });

  describe('disconnect', () => {
    it('removes the element from its group', () => {
      const r1 = makeRadio('g4', 'a');
      const r2 = makeRadio('g4', 'b');
      radioGroups.connect(r1);
      radioGroups.connect(r2);
      radioGroups.disconnect(r1);

      expect(radioGroups.groups.get('g4')?.has(r1)).toBe(false);
      expect(radioGroups.groups.get('g4')?.has(r2)).toBe(true);
    });

    it('removes the group entry when the last element disconnects', () => {
      const radio = makeRadio('g5', 'a');
      radioGroups.connect(radio);
      radioGroups.disconnect(radio);

      expect(radioGroups.groups.has('g5')).toBe(false);
    });

    it('does nothing when the element group does not exist', () => {
      const radio = makeRadio('unknown-group', 'a');
      expect(() => radioGroups.disconnect(radio)).not.toThrow();
    });

    it('does not affect elements in other groups', () => {
      const r1 = makeRadio('g6a', 'a');
      const r2 = makeRadio('g6b', 'b');
      radioGroups.connect(r1);
      radioGroups.connect(r2);
      radioGroups.disconnect(r1);

      expect(radioGroups.groups.has('g6b')).toBe(true);
      expect(radioGroups.groups.get('g6b')?.has(r2)).toBe(true);
    });
  });

  describe('updateValue', () => {
    it('marks the selected element as checked and clears the others', () => {
      const r1 = makeRadio('g7', 'a', true);
      const r2 = makeRadio('g7', 'b');
      const r3 = makeRadio('g7', 'c');
      radioGroups.connect(r1);
      radioGroups.connect(r2);
      radioGroups.connect(r3);

      radioGroups.updateValue(r2);

      expect(r1.checked).toBe(false);
      expect(r2.checked).toBe(true);
      expect(r3.checked).toBe(false);
    });

    it('syncs the checked state to the inner input element', () => {
      const r1 = makeRadio('g8', 'a');
      const r2 = makeRadio('g8', 'b');
      radioGroups.connect(r1);
      radioGroups.connect(r2);

      radioGroups.updateValue(r1);

      expect(r1.el.checked).toBe(true);
      expect(r2.el.checked).toBe(false);
    });

    it('calls setFormValue(value) on the selected element', () => {
      const r1 = makeRadio('g9', 'yes');
      const r2 = makeRadio('g9', 'no');
      radioGroups.connect(r1);
      radioGroups.connect(r2);

      radioGroups.updateValue(r1);

      expect(r1.internals.setFormValue).toHaveBeenCalledWith('yes');
    });

    it('calls setFormValue(null) on all non-selected elements', () => {
      const r1 = makeRadio('g10', 'a');
      const r2 = makeRadio('g10', 'b');
      const r3 = makeRadio('g10', 'c');
      radioGroups.connect(r1);
      radioGroups.connect(r2);
      radioGroups.connect(r3);

      radioGroups.updateValue(r1);

      expect(r2.internals.setFormValue).toHaveBeenCalledWith(null);
      expect(r3.internals.setFormValue).toHaveBeenCalledWith(null);
    });

    it('does not touch radios in other groups', () => {
      const r1 = makeRadio('g11a', 'a');
      const r2 = makeRadio('g11b', 'b');
      radioGroups.connect(r1);
      radioGroups.connect(r2);

      radioGroups.updateValue(r1);

      expect(r2.checked).toBe(false);
      expect(r2.internals.setFormValue).not.toHaveBeenCalled();
    });

    it('skips the inner input sync when el is not yet available', () => {
      const radio = makeRadio('g12', 'a');
      (radio as unknown as { el: null }).el = null;
      radioGroups.connect(radio);

      // Should not throw, and setFormValue is still called even without el
      expect(() => radioGroups.updateValue(radio)).not.toThrow();
      expect(radio.internals.setFormValue).toHaveBeenCalledWith('a');
    });
  });

  describe('reset', () => {
    it('sets checked to false when called with checked=false', () => {
      const radio = makeRadio('g13', 'a', true);
      radioGroups.connect(radio);

      radioGroups.reset(radio, false);

      expect(radio.checked).toBe(false);
    });

    it('calls setFormValue(null) when resetting to unchecked', () => {
      const radio = makeRadio('g14', 'a', true);
      radioGroups.connect(radio);

      radioGroups.reset(radio, false);

      expect(radio.internals.setFormValue).toHaveBeenCalledWith(null);
    });

    it('sets checked to true when called with checked=true', () => {
      const radio = makeRadio('g15', 'a');
      radioGroups.connect(radio);

      radioGroups.reset(radio, true);

      expect(radio.checked).toBe(true);
    });

    it('calls setFormValue(value) on the reset radio when resetting to checked', () => {
      const radio = makeRadio('g16', 'a');
      radioGroups.connect(radio);

      radioGroups.reset(radio, true);

      expect(radio.internals.setFormValue).toHaveBeenCalledWith('a');
    });

    it('deselects other radios in the group when resetting to checked', () => {
      const r1 = makeRadio('g17', 'a');
      const r2 = makeRadio('g17', 'b', true);
      const r3 = makeRadio('g17', 'c', true);
      radioGroups.connect(r1);
      radioGroups.connect(r2);
      radioGroups.connect(r3);

      radioGroups.reset(r1, true);

      expect(r1.checked).toBe(true);
      expect(r2.checked).toBe(false);
      expect(r3.checked).toBe(false);
      expect(r2.internals.setFormValue).toHaveBeenCalledWith(null);
      expect(r3.internals.setFormValue).toHaveBeenCalledWith(null);
    });

    it('does not affect other groups when resetting to checked', () => {
      const r1 = makeRadio('g18a', 'a');
      const r2 = makeRadio('g18b', 'b', true);
      radioGroups.connect(r1);
      radioGroups.connect(r2);

      radioGroups.reset(r1, true);

      expect(r2.checked).toBe(true);
      expect(r2.internals.setFormValue).not.toHaveBeenCalled();
    });
  });
});
