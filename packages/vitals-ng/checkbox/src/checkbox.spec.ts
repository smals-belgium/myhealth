import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';

import { Checkbox } from './checkbox';
import { CheckboxRequiredValidator } from './checkbox-required.validator';

@Component({
  template: `
    <form #form="ngForm">
      <mh-checkbox
        name="accept"
        required
        [(ngModel)]="value"
        >Accept</mh-checkbox
      >
    </form>
  `,
  imports: [FormsModule, Checkbox, CheckboxRequiredValidator],
})
class TestHost {
  value = false;
  form = viewChild.required<NgForm>('form');
}

describe('checkbox form integration', () => {
  it('marks the form valid when the checkbox is checked', async () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const form = fixture.componentInstance.form();
    expect(form.valid).toBe(false);

    const checkbox = fixture.nativeElement.querySelector('mh-checkbox');
    checkbox.querySelector('input')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(form.valid).toBe(true);
  });
});
