import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type {
  TabGroupSelectedChangeEvent,
  TabLinkNavigateEvent,
} from '@smals-belgium-shared/vitals/tabs';
import { ICON } from '@smals-belgium-shared/vitals-ng/icon';
import { TABS } from '@smals-belgium-shared/vitals-ng/tabs';

@Component({
  imports: [TABS, ICON],
  template: `
    <h2>Tabs</h2>

    <h3>Basic</h3>
    <mh-tab-group>
      <mh-tab label="Account">
        <p>Manage your account details here.</p>
      </mh-tab>
      <mh-tab label="Notifications">
        <p>Manage your notification preferences here.</p>
      </mh-tab>
      <mh-tab label="Privacy">
        <p>Manage your privacy settings here.</p>
      </mh-tab>
    </mh-tab-group>

    <h3>Disabled tab</h3>
    <mh-tab-group>
      <mh-tab label="Overview">
        <p>Overview content.</p>
      </mh-tab>
      <mh-tab
        label="Archived"
        [disabled]="true"
      >
        <p>Archived content (unreachable while disabled).</p>
      </mh-tab>
      <mh-tab label="Settings">
        <p>Settings content.</p>
      </mh-tab>
    </mh-tab-group>

    <h3>Rich labels</h3>
    <mh-tab-group>
      <mh-tab label="Home">
        <span slot="tab-label"
          ><mh-icon
            name="home"
            size="s"
          ></mh-icon>
          Home</span
        >
        <p>Home content.</p>
      </mh-tab>
      <mh-tab label="Settings">
        <span slot="tab-label"
          ><mh-icon
            name="settings"
            size="s"
          ></mh-icon>
          Settings</span
        >
        <p>Settings content.</p>
      </mh-tab>
    </mh-tab-group>

    <h3>Programmatic selection</h3>
    <p>Selected tab index: {{ selectedIndex() }}</p>
    <mh-tab-group
      [selectedIndex]="selectedIndex()"
      (mh-tab-group-selected-change)="onSelectedChange($event)"
    >
      <mh-tab label="One">
        <p>Panel one.</p>
      </mh-tab>
      <mh-tab label="Two">
        <p>Panel two.</p>
      </mh-tab>
      <mh-tab label="Three">
        <p>Panel three.</p>
      </mh-tab>
    </mh-tab-group>

    <h3>Link tabs</h3>
    <p>{{ linkEventLog() }}</p>
    <mh-tab-group (mh-tab-link-navigate)="onTabLinkNavigate($event)">
      <mh-tab-link
        label="Overview"
        href="/tabs-ng"
      ></mh-tab-link>
      <mh-tab-link
        label="Docs"
        href="/tabs-ng"
        target="_blank"
      ></mh-tab-link>
      <mh-tab-link
        label="Disabled"
        href="/tabs-ng"
        [disabled]="true"
      ></mh-tab-link>
    </mh-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsSandbox {
  readonly selectedIndex = signal(0);
  readonly linkEventLog = signal('No navigation yet.');

  onSelectedChange(event: TabGroupSelectedChangeEvent) {
    this.selectedIndex.set(event.index);
  }

  onTabLinkNavigate(event: TabLinkNavigateEvent) {
    // Prevent the actual navigation so the demo page stays put; just log it.
    event.preventDefault();
    this.linkEventLog.set(`Would navigate to: ${event.href}`);
  }
}
