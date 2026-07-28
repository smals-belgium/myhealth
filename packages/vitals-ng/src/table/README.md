# @myhealth/vitals-ng/table

Secondary entry point of `@myhealth/vitals-ng`. It can be used by importing from `@myhealth/vitals-ng/table`.

## Usage

```typescript
import { TABLE } from '@myhealth/vitals-ng/table';

@NgModule({
  imports: [TABLE],
})3
export class AppModule {}
```

Or with standalone components:

```typescript
import { TABLE } from '@myhealth/vitals-ng/table';
import type { SelectionMode } from '@smals-belgium-shared/vitals/table';

@Component({
  imports: [TABLE],
  template: `
    <mh-table
      [selectionMode]="selectionMode"
      (selectionChange)="onSelectionChange($event)"
    >
      <mh-table-header-cell slot="header">Name</mh-table-header-cell>
      <mh-table-row
        value="1"
        [(selected)]="aliceSelected"
      >
        <mh-table-cell>Alice</mh-table-cell>
      </mh-table-row>
    </mh-table>
  `,
})
export class MyComponent {
  selectionMode: SelectionMode = 'multi';
  aliceSelected = false;

  onSelectionChange(selected: string[]) {
    console.log('Selected rows:', selected);
  }
}
```

## `mh-table`

### Inputs

| Input           | Type            | Default  | Description                                                                                                                                           |
| --------------- | --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `selectionMode` | `SelectionMode` | `'none'` | `'none'` disables selection. `'single'` allows one selected row via a radio button per row (no select-all). `'multi'` adds checkboxes and select-all. |
| `caption`       | `string`        | `''`     | Accessible label for the table (exposed as `aria-label`).                                                                                             |

### Outputs

| Output            | Type       | Description                             |
| ----------------- | ---------- | --------------------------------------- |
| `selectionChange` | `string[]` | Emitted when the row selection changes. |

## `mh-table-row`

Automatically becomes expandable when content is projected into its `expansion` slot — there is no `expandable` input to set.

### Inputs

| Input      | Type      | Default | Description                                                     |
| ---------- | --------- | ------- | --------------------------------------------------------------- |
| `value`    | `string`  | `''`    | Identifier reported in the table's selection change event.      |
| `expanded` | `boolean` | `false` | Whether the expansion region is visible. Two-way bindable.      |
| `selected` | `boolean` | `false` | Whether this row's checkbox/radio is checked. Two-way bindable. |
| `disabled` | `boolean` | `false` | Shows the checkbox/radio but makes it non-interactive.          |

### Outputs

| Output           | Type      | Description                                      |
| ---------------- | --------- | ------------------------------------------------ |
| `selectedChange` | `boolean` | Emitted when this row's selection state changes. |
| `expandedChange` | `boolean` | Emitted when this row is expanded or collapsed.  |

## `mh-table-cell`

Renders a single body cell (`role="cell"`). Has no inputs.

## `mh-table-header-cell`

Renders a column header cell (`role="columnheader"`). Slot it into the `header` slot of `mh-table`. Has no inputs.
