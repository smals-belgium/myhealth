# @myhealth/vitals-ng/tabs

Secondary entry point of `@myhealth/vitals-ng`. It can be used by importing from `@myhealth/vitals-ng/tabs`.

## Usage

```ts
import { TABS } from '@myhealth/vitals-ng/tabs';

@Component({
  imports: [TABS],
  template: `
    <mh-tab-group
      [selectedIndex]="selectedIndex()"
      (mh-tab-group-selected-change)="selectedIndex.set($event.index)"
    >
      <mh-tab label="Account"><p>Account content.</p></mh-tab>
      <mh-tab label="Notifications"><p>Notifications content.</p></mh-tab>
      <mh-tab
        label="Privacy"
        [disabled]="true"
        ><p>Privacy content.</p></mh-tab
      >
    </mh-tab-group>
  `,
})
export class MyComponent {
  readonly selectedIndex = signal(0);
}
```

Use `mh-tab-link` for navigation tabs that route instead of switching panels:

```html
<mh-tab-group (mh-tab-link-navigate)="router.navigateByUrl($event.href)">
  <mh-tab-link
    label="Overview"
    href="/overview"
  ></mh-tab-link>
  <mh-tab-link
    label="Settings"
    href="/settings"
  ></mh-tab-link>
</mh-tab-group>
```
