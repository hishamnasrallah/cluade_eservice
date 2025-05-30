// config.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../core/services/config.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-config',
  template: `
    <div class="config-container">
      <div class="config-card">
        <h2>Backend Configuration</h2>
        <form (ngSubmit)="saveConfig()" #configForm="ngForm">
          <div class="form-group">
            <label for="baseUrl">Backend URL:</label>
            <input
              type="url"
              id="baseUrl"
              name="baseUrl"
              [(ngModel)]="baseUrl"
              placeholder="https://api.example.com"
              required
              class="form-control">
          </div>
          <button type="submit" [disabled]="!configForm.valid" class="btn btn-primary">
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  `,
  imports: [
    FormsModule
  ],
  styles: [`
    .config-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .config-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ConfigComponent {
  baseUrl = '';

constructor(
private configService: ConfigService,
private router: Router
) {
  this.baseUrl = this.configService.getBaseUrl();
}

saveConfig(): void {
  this.configService.setBaseUrl(this.baseUrl);
  this.router.navigate(['/login']);
}
}
