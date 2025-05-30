// applications.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-applications',
  template: `
    <div class="applications-container">
      <h2>My Applications</h2>

      <div class="tabs">
        <button
          *ngFor="let tab of tabs"
          class="tab-button"
          [class.active]="activeTab === tab.key"
          (click)="setActiveTab(tab.key)">
          {{ tab.label }}
          <span class="badge" *ngIf="tab.count > 0">{{ tab.count }}</span>
        </button>
      </div>

      <div class="tab-content">
        <div *ngIf="applications.length === 0" class="empty-state">
          <p>No {{ activeTab }} applications found.</p>
        </div>

        <div *ngFor="let app of applications" class="application-card">
          <div class="app-header">
            <h3>{{ app.service_name }}</h3>
            <span class="status-badge" [class]="'status-' + app.status">
              {{ app.status }}
            </span>
          </div>
          <div class="app-details">
            <p><strong>Reference:</strong> {{ app.reference_number }}</p>
            <p><strong>Submitted:</strong> {{ app.created_date | date }}</p>
            <p *ngIf="app.last_update"><strong>Last Update:</strong> {{ app.last_update | date }}</p>
          </div>
          <div class="app-actions">
            <button class="btn btn-sm btn-primary" (click)="viewApplication(app)">
              View Details
            </button>
            <button
              *ngIf="app.status === 'draft'"
              class="btn btn-sm btn-success"
              (click)="editApplication(app)">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .applications-container {
      padding: 2rem;
    }
    .tabs {
      display: flex;
      border-bottom: 2px solid #e9ecef;
      margin-bottom: 2rem;
    }
    .tab-button {
      background: none;
      border: none;
      padding: 1rem 2rem;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
    }
    .tab-button.active {
      border-bottom-color: #007bff;
      color: #007bff;
    }
    .badge {
      background-color: #dc3545;
      color: white;
      border-radius: 12px;
      padding: 2px 6px;
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }
    .application-card {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .status-draft { background-color: #ffc107; color: #212529; }
    .status-submitted { background-color: #17a2b8; color: white; }
    .status-returned { background-color: #dc3545; color: white; }
    .status-completed { background-color: #28a745; color: white; }
    .app-details p {
      margin: 0.5rem 0;
      color: #6c757d;
    }
    .app-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }
    .btn-sm { padding: 0.25rem 0.75rem; }
    .btn-primary { background-color: #007bff; color: white; }
    .btn-success { background-color: #28a745; color: white; }
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
    }
  `]
})
export class ApplicationsComponent implements OnInit {
  activeTab = 'draft';
  applications: any[] = [];

  tabs = [
    { key: 'draft', label: 'Draft', count: 0 },
    { key: 'submitted', label: 'Submitted', count: 0 },
    { key: 'returned', label: 'Returned', count: 0 },
    { key: 'completed', label: 'Completed', count: 0 }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.loadApplications();
  }

  loadApplications(): void {
    this.apiService.get<any>(`/case/cases/?status=${this.activeTab}`).subscribe({
      next: (response) => {
        this.applications = response.results || [];
        this.updateTabCounts();
      },
      error: (error) => {
        console.error('Error loading applications:', error);
      }
    });
  }

  updateTabCounts(): void {
    // Update tab counts based on loaded data
    // This would typically come from a separate API call
  }

  viewApplication(app: any): void {
    // Navigate to application details
    console.log('View application:', app);
  }

  editApplication(app: any): void {
    // Navigate to edit mode
    console.log('Edit application:', app);
  }
}
