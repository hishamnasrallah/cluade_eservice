// service-wizard.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormService } from '../../core/services/dynamic-form.service';
import { ServiceFlowStep } from '../../core/models/form.model';

@Component({
  selector: 'app-service-wizard',
  template: `
    <div class="wizard-container">
      <div class="wizard-header">
        <h2>{{ currentStep?.name || 'Service Application' }}</h2>
        <div class="progress-bar">
          <div
            *ngFor="let step of visibleSteps; let i = index"
            class="progress-step"
            [class.active]="i === currentStepIndex"
            [class.completed]="i < currentStepIndex">
            <span class="step-number">{{ i + 1 }}</span>
            <span class="step-name">{{ step.name }}</span>
          </div>
        </div>
      </div>

      <div class="wizard-content">
        <div *ngIf="currentStep?.description" class="step-description">
          <div [innerHTML]="currentStep.description"></div>
        </div>

        <app-dynamic-form
          *ngIf="currentStep && !isInstructionStep"
          [categories]="currentStep.categories"
          [formData]="formData"
          (formChange)="onFormChange($event)"
          (validationChange)="onValidationChange($event)">
        </app-dynamic-form>
      </div>

      <div class="wizard-actions">
        <button
          *ngIf="currentStepIndex > 0"
          (click)="previousStep()"
          class="btn btn-secondary">
          Previous
        </button>

        <button
          *ngIf="!isLastStep"
          (click)="nextStep()"
          [disabled]="!isCurrentStepValid"
          class="btn btn-primary">
          Next
        </button>

        <button
          *ngIf="isLastStep"
          (click)="submitForm()"
          [disabled]="!isFormValid || isSubmitting"
          class="btn btn-success">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .wizard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .wizard-header {
      margin-bottom: 2rem;
    }
    .progress-bar {
      display: flex;
      margin-top: 1rem;
      overflow-x: auto;
    }
    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 2rem;
      min-width: 120px;
    }
    .progress-step.active .step-number {
      background-color: #007bff;
      color: white;
    }
    .progress-step.completed .step-number {
      background-color: #28a745;
      color: white;
    }
    .step-number {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
    }
    .step-name {
      text-align: center;
      font-size: 0.9rem;
    }
    .step-description {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      white-space: pre-line;
    }
    .wizard-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #dee2e6;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }
    .btn-primary { background-color: #007bff; color: white; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-success { background-color: #28a745; color: white; }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ServiceWizardComponent implements OnInit {
  serviceId!: string;
  steps: ServiceFlowStep[] = [];
  visibleSteps: ServiceFlowStep[] = [];
  currentStepIndex = 0;
  formData: any = {};
  isCurrentStepValid = true;
  isFormValid = false;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dynamicFormService: DynamicFormService
  ) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId')!;
    this.loadServiceFlow();
  }

  get currentStep(): ServiceFlowStep | null {
    return this.visibleSteps[this.currentStepIndex] || null;
  }

  get isLastStep(): boolean {
    return this.currentStepIndex === this.visibleSteps.length - 1;
  }

  get isInstructionStep(): boolean {
    return this.currentStep?.categories.length === 0;
  }

  loadServiceFlow(): void {
    this.dynamicFormService.getServiceFlow(this.serviceId).subscribe({
      next: (response) => {
        this.steps = response.service_flow
          .filter(step => !step.is_hidden_page)
          .sort((a, b) => a.sequence_number.localeCompare(b.sequence_number));
        this.visibleSteps = [...this.steps];
        this.currentStepIndex = 0;
      },
      error: (error) => {
        console.error('Error loading service flow:', error);
      }
    });
  }

  onFormChange(data: any): void {
    this.formData = { ...this.formData, ...data };
  }

  onValidationChange(isValid: boolean): void {
    this.isCurrentStepValid = isValid;
    this.updateFormValidity();
  }

  updateFormValidity(): void {
    // Check if all required fields in all completed steps are valid
    this.isFormValid = this.isCurrentStepValid;
  }

  nextStep(): void {
    if (this.currentStepIndex < this.visibleSteps.length - 1) {
      this.currentStepIndex++;
    }
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  submitForm(): void {
    this.isSubmitting = true;

    // Prepare submission data
    const submissionData = {
      applicant_type: 13, // You may need to determine this dynamically
      case_type: parseInt(this.serviceId),
      case_data: this.formData
    };

    this.dynamicFormService.submitCase(submissionData).subscribe({
      next: (response) => {
        alert('Application submitted successfully!');
        this.router.navigate(['/home/applications']);
      },
      error: (error) => {
        console.error('Error submitting form:', error);
        alert('Error submitting application. Please try again.');
        this.isSubmitting = false;
      }
    });
  }
}
