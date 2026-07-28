import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { SelectionMode } from '@smals-belgium-shared/vitals/table';
import { BUTTON } from '@smals-belgium-shared/vitals-ng/button';
import { TABLE } from '@smals-belgium-shared/vitals-ng/table';

interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-table',
  imports: [BUTTON, TABLE],
  template: `
    <h2>Table</h2>

    <label>
      selection mode
      <select
        [value]="selectionMode()"
        (change)="selectionMode.set($any($event.target).value)"
      >
        <option value="none">none</option>
        <option value="single">single</option>
        <option value="multi">multi</option>
      </select>
    </label>

    <mh-table
      [selectionMode]="selectionMode()"
      [caption]="'Team members'"
      (selectionChange)="onSelectionChange($event)"
    >
      <mh-table-header-cell slot="header">Name</mh-table-header-cell>
      <mh-table-header-cell slot="header">Email</mh-table-header-cell>
      <mh-table-header-cell slot="header">Role</mh-table-header-cell>

      @for (person of people; track person.id) {
        <mh-table-row
          [value]="person.id"
          [disabled]="person.disabled ?? false"
          [(selected)]="selectedRows[person.id]"
          [(expanded)]="expandedRows[person.id]"
          (selectedChange)="onRowSelectedChange(person, $event)"
          (expandedChange)="onRowExpandedChange(person, $event)"
        >
          <mh-table-cell>{{ person.name }}</mh-table-cell>
          <mh-table-cell>{{ person.email }}</mh-table-cell>
          <mh-table-cell>{{ person.role }}</mh-table-cell>
          <div slot="expansion">
            Extra details for <strong>{{ person.name }}</strong> ({{
              person.email
            }})
          </div>
        </mh-table-row>
      }
    </mh-table>

    <footer>
      <mh-button (click)="selectAll()">select all</mh-button>
      <mh-button
        appearance="outlined"
        (click)="clearSelection()"
        >clear selection</mh-button
      >
      <mh-button
        appearance="outlined"
        (click)="expandAll()"
        >expand all</mh-button
      >
    </footer>

    <section>
      <h3>Event log</h3>
      <ul>
        @for (entry of log(); track $index) {
          <li>{{ entry }}</li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  readonly selectionMode = signal<SelectionMode>('multi');
  readonly log = signal<string[]>([]);

  readonly people: Person[] = [
    { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: '2', name: 'Bob', email: 'bob@example.com', role: 'Editor' },
    {
      id: '3',
      name: 'Carol',
      email: 'carol@example.com',
      role: 'Viewer',
      disabled: true,
    },
  ];

  selectedRows: Record<string, boolean> = {};
  expandedRows: Record<string, boolean> = {};

  onSelectionChange(selected: string[]) {
    this.#addLog(`table selectionChange: [${selected.join(', ')}]`);
  }

  onRowSelectedChange(person: Person, selected: boolean) {
    this.#addLog(`row ${person.name} selectedChange: ${String(selected)}`);
  }

  onRowExpandedChange(person: Person, expanded: boolean) {
    this.#addLog(`row ${person.name} expandedChange: ${String(expanded)}`);
  }

  selectAll() {
    for (const person of this.people)
      if (!person.disabled) this.selectedRows[person.id] = true;
  }

  clearSelection() {
    this.selectedRows = {};
  }

  expandAll() {
    for (const person of this.people) this.expandedRows[person.id] = true;
  }

  #addLog(message: string) {
    this.log.update(entries => [message, ...entries].slice(0, 10));
  }
}
