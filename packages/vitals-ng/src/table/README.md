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

@Component({
  imports: [TABLE],
  template: `
    <mh-table
      [selectable]="selectable"
      (selectionChange)="onSelectionChange($event)"
    >
      <mh-table-cell
        slot="header"
        header
        >Name</mh-table-cell
      >
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
  selectable = true;
  aliceSelected = false;

  onSelectionChange(selected: string[]) {
    console.log('Selected rows:', selected);
  }
}
```

## `mh-table`

### Inputs

| Input        | Type      | Default | Description                                               |
| ------------ | --------- | ------- | --------------------------------------------------------- |
| `selectable` | `boolean` | `false` | Enables row selection with checkboxes and select-all.     |
| `caption`    | `string`  | `''`    | Accessible label for the table (exposed as `aria-label`). |

### Outputs

| Output            | Type       | Description                             |
| ----------------- | ---------- | --------------------------------------- |
| `selectionChange` | `string[]` | Emitted when the row selection changes. |

## `mh-table-row`

### Inputs

| Input        | Type      | Default | Description                                                  |
| ------------ | --------- | ------- | ------------------------------------------------------------ |
| `value`      | `string`  | `''`    | Identifier reported in the table's selection change event.   |
| `expandable` | `boolean` | `false` | Shows a chevron button to expand/collapse extra row content. |
| `expanded`   | `boolean` | `false` | Whether the expansion region is visible. Two-way bindable.   |
| `selected`   | `boolean` | `false` | Whether this row's checkbox is checked. Two-way bindable.    |
| `disabled`   | `boolean` | `false` | Shows the checkbox but makes it non-interactive.             |

### Outputs

| Output           | Type      | Description                                      |
| ---------------- | --------- | ------------------------------------------------ |
| `selectedChange` | `boolean` | Emitted when this row's selection state changes. |
| `expandedChange` | `boolean` | Emitted when this row is expanded or collapsed.  |

## `mh-table-cell`

### Inputs

| Input    | Type      | Default | Description                                           |
| -------- | --------- | ------- | ----------------------------------------------------- |
| `header` | `boolean` | `false` | Renders the cell as a column header (`columnheader`). |
