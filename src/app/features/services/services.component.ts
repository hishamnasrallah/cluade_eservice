// services.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicFormService } from '../../core/services/dynamic-form.service';
import { LookupOption } from '../../core/models/form.model';

@Component({
  selector: 'app-services',
  template: `
    <div class="services-container">
      <h2>Available Services</h2>
      <div class="services-grid">
        <div
          *ngFor="let service of services"
          class="service-card"
          (click)="selectService(service)">
          <div class="service-icon">
            <img *ngIf="service.icon" [src]="service.icon" [alt]="service.name">
            <div *ngIf="!service.icon" class="default-icon">📋</div>
          </div>
          <h3>{{ service.name }}</h3>
          <p *ngIf="service.name_ara">{{ service.name_ara }}</p>
          <span class="service-code">Code: {{ service.code }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .services-container {
      padding: 2rem;
    }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .service-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .service-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }
    .service-icon {
      margin-bottom: 1rem;
    }
    .service-icon img {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 8px;
    }
    .default-icon {
      font-size: 3rem;
    }
    .service-code {
      color: #666;
      font-size: 0.9rem;
    }
  `]
})
export class ServicesComponent implements OnInit {
  services: LookupOption[] = [];

  constructor(
    private dynamicFormService: DynamicFormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.dynamicFormService.getLookupData(undefined, 'Service').subscribe({
      next: (response) => {
        this.services = response.results.filter(service => service.active_ind);
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  selectService(service: LookupOption): void {
    this.router.navigate(['/service-wizard', service.id]);
  }
}
