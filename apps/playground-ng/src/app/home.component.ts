import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  template: `<nav>
    <ul>
      <li><a href="/button">button</a></li>
      <li><a href="/checkbox">checkbox</a></li>
      <li><a href="/divider">divider</a></li>
      <li><a href="/form-sandbox">form-sandbox</a></li>
      <li><a href="/icon">icon</a></li>
      <li><a href="/icon-button">icon-button</a></li>
      <li><a href="/radio">radio</a></li>
      <li><a href="/skeleton">skeleton</a></li>
      <li><a href="/slide-toggle">slide-toggle</a></li>
      <li><a href="/spinner">spinner</a></li>
      <li><a href="/table">table</a></li>
    </ul>
  </nav> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
