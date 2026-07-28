/* eslint-disable import/max-dependencies*/
import { Route } from '@angular/router';

import { ButtonSandbox } from './button-ng.sandbox';
import { CalloutSandbox } from './callout-ng.sandbox';
import { CardSandbox } from './card-ng.sandbox';
import { CheckboxSandbox } from './checkbox-ng.sandbox';
import { DialogSandbox } from './dialog-ng.sandbox';
import { DividerSandbox } from './divider-ng.sandbox';
import { FormSandbox } from './form.sandbox';
import { Home } from './home';
import { IconButtonSandbox } from './icon-button-ng.sandbox';
import { IconSandbox } from './icon-ng.sandbox';
import { RadioSandbox } from './radio-ng.sandbox';
import { SelectSandbox } from './select-ng.sandbox';
import { SkeletonSandbox } from './skeleton-ng.sandbox';
import { SlideToggleSandbox } from './slide-toggle-ng.sandbox';
import { SnackbarSandbox } from './snackbar-ng.sandbox';
import { SpinnerSandbox } from './spinner-ng.sandbox';
import { TableComponent } from './table-ng.sandbox';
import { TextInputSandbox } from './text-input-ng.sandbox';
import { TooltipSandbox } from './tooltip-ng.sandbox';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'button',
    component: ButtonSandbox,
  },
  {
    path: 'callout',
    component: CalloutSandbox,
  },
  {
    path: 'card',
    component: CardSandbox,
  },
  {
    path: 'checkbox',
    component: CheckboxSandbox,
  },
  {
    path: 'dialog',
    component: DialogSandbox,
  },
  {
    path: 'divider',
    component: DividerSandbox,
  },
  {
    path: 'form-sandbox',
    component: FormSandbox,
  },
  {
    path: 'icon',
    component: IconSandbox,
  },
  {
    path: 'icon-button',
    component: IconButtonSandbox,
  },
  {
    path: 'radio',
    component: RadioSandbox,
  },
  {
    path: 'select',
    component: SelectSandbox,
  },
  {
    path: 'skeleton',
    component: SkeletonSandbox,
  },
  {
    path: 'slide-toggle',
    component: SlideToggleSandbox,
  },
  {
    path: 'snackbar',
    component: SnackbarSandbox,
  },
  {
    path: 'spinner',
    component: SpinnerSandbox,
  },
  {
    path: 'table',
    component: TableComponent,
  },
  {
    path: 'text-input',
    component: TextInputSandbox,
  },
  {
    path: 'tooltip',
    component: TooltipSandbox,
  },
];
