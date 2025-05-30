// app.component.ts
import { Component, OnInit } from '@angular/core';
import { ConfigService } from './core/services/config.service';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [
    RouterOutlet
  ],
  styles: [`
    .app-container {
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'dynamic-forms-app';

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    // Initialize configuration service
  }
}
