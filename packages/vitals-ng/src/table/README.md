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
      (mh-table-selection-change)="onSelectionChange($event)"
    >
      <mh-table-cell
        slot="header"
        header
        >Name</mh-table-cell
      >
      <mh-table-row value="1"><mh-table-cell>Alice</mh-table-cell></mh-table-row>
    </mh-table>
  `,
})
export class MyComponent {
  selectable = true;

  onSelectionChange(selected: string[]) {
    console.log('Selected rows:', selected);
  }
}
```

## Inputs

| Input        | Type      | Default | Description                                           |
| ------------ | --------- | ------- | ----------------------------------------------------- |
| `selectable` | `boolean` | `false` | Enables row selection with checkboxes and select-all. |

## Outputs

| Output                      | Type       | Description                             |
| --------------------------- | ---------- | --------------------------------------- |
| `mh-table-selection-change` | `string[]` | Emitted when the row selection changes. |
