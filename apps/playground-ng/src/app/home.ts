import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  template: `
    <nav>
      <ul>
        <li><a routerLink="/form-sandbox">form-sandbox</a></li>
      </ul>
      <ul>
        <li><a routerLink="/button">button</a></li>
        <li><a routerLink="/callout">callout</a></li>
        <li><a routerLink="/card">card</a></li>
        <li><a routerLink="/checkbox">checkbox</a></li>
        <li><a routerLink="/dialog">dialog</a></li>
        <li><a routerLink="/divider">divider</a></li>
        <li><a routerLink="/icon">icon</a></li>
        <li><a routerLink="/icon-button">icon-button</a></li>
        <li><a routerLink="/radio">radio</a></li>
        <li><a routerLink="/select">select</a></li>
        <li><a routerLink="/skeleton">skeleton</a></li>
        <li><a routerLink="/slide-toggle">slide-toggle</a></li>
        <li><a routerLink="/snackbar">snackbar</a></li>
        <li><a routerLink="/spinner">spinner</a></li>
        <li><a routerLink="/table">tabs</a></li>
        <li><a routerLink="/tabs">tabs</a></li>
        <li><a routerLink="/text-input">text-input</a></li>
        <li><a routerLink="/tooltip">tooltip</a></li>
      </ul>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
