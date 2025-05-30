// dynamic-field.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormService } from '../../core/services/dynamic-form.service';
import { FormField, LookupOption } from '../../core/models/form.model';

@Component({
  selector: 'app-dynamic-field',
  template: `
    <div class="form-field" [class.field-disabled]="field.is_disabled">
      <label [for]="field.name" class="field-label">
        {{ field.display_name }}
        <span *ngIf="field.mandatory" class="required">*</span>
        <span *ngIf="field.display_name_ara" class="label-ara">({{ field.display_name_ara }})</span>
      </label>

      <!-- Text Field -->
      <input
        *ngIf="field.field_type === 'text'"
        type="text"
        [id]="field.name"
        [formControlName]="field.name"
        [disabled]="field.is_disabled"
        [placeholder]="field.display_name"
        class="form-control"
        (input)="onValueChange($event)">

      <!-- Number Fields -->
      <input
        *ngIf="field.field_type === 'number' || field.field_type === 'decimal' || field.field_type === 'percentage'"
        [type]="field.integer_only ? 'number' : 'number'"
        [step]="getNumberStep()"
        [id]="field.name"
        [formControlName]="field.name"
        [disabled]="field.is_disabled"
        [placeholder]="field.display_name"
        class="form-control"
        (input)="onValueChange($event)">

      <!-- Boolean Field -->
      <div *ngIf="field.field_type === 'boolean'" class="checkbox-wrapper">
        <input
          type="checkbox"
          [id]="field.name"
          [formControlName]="field.name"
          [disabled]="field.is_disabled"
          (change)="onValueChange($event)">
        <label [for]="field.name" class="checkbox-label">{{ field.display_name }}</label>
      </div>

      <!-- Choice Field -->
      <select
        *ngIf="field.field_type === 'choice'"
        [id]="field.name"
        [formControlName]="field.name"
        [disabled]="field.is_disabled"
        class="form-control"
        (change)="onValueChange($event)">
        <option value="">Select {{ field.display_name }}</option>
        <option
          *ngFor="let option of lookupOptions"
          [value]="option.id">
          {{ option.name }} {{ option.name_ara ? '(' + option.name_ara + ')' : '' }}
        </option>
      </select>

      <!-- File Field -->
      <div *ngIf="field.field_type === 'file'" class="file-field">
        <input
          type="file"
          [id]="field.name"
          [accept]="getAcceptedFileTypes()"
          [disabled]="field.is_disabled"
          class="form-control"
          (change)="onFileChange($event)">
        <div *ngIf="selectedFile" class="file-info">
          Selected: {{ selectedFile.name }}
        </div>
      </div>

      <!-- Sub Fields (Nested/Repeatable) -->
      <div *ngIf="field.sub_fields && field.sub_fields.length > 0" class="sub-fields">
        <h4>{{ field.display_name }} Details</h4>
        <app-dynamic-field
          *ngFor="let subField of field.sub_fields"
          [field]="subField"
          [formGroup]="formGroup"
          [formData]="formData"
          (fieldChange)="onFieldChange($event)">
        </app-dynamic-field>
      </div>

      <!-- Validation Messages -->
      <div *ngIf="formGroup.get(field.name)?.invalid && formGroup.get(field.name)?.touched"
           class="validation-errors">
        <div *ngIf="formGroup.get(field.name)?.errors?.['required']">
          {{ field.display_name }} is required
        </div>
        <div *ngIf="formGroup.get(field.name)?.errors?.['minlength']">
          Minimum length is {{ field.min_length }} characters
        </div>
        <div *ngIf="formGroup.get(field.name)?.errors?.['maxlength']">
          Maximum length is {{ field.max_length }} characters
        </div>
        <div *ngIf="formGroup.get(field.name)?.errors?.['min']">
          Value must be greater than {{ field.value_greater_than }}
        </div>
        <div *ngIf="formGroup.get(field.name)?.errors?.['max']">
          Value must be less than {{ field.value_less_than }}
        </div>
        <div *ngIf="formGroup.get(field.name)?.errors?.['pattern']">
          Invalid format
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-field {
      margin-bottom: 1rem;
    }
    .field-disabled {
      opacity: 0.6;
    }
    .field-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .required {
      color: #dc3545;
    }
    .label-ara {
      font-style: italic;
      color: #6c757d;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }
    .form-control:focus {
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
    .checkbox-wrapper {
      display: flex;
      align-items: center;
    }
    .checkbox-wrapper input[type="checkbox"] {
      margin-right: 0.5rem;
    }
    .checkbox-label {
      margin: 0;
    }
    .file-field {
      border: 2px dashed #ced4da;
      padding: 1rem;
      border-radius: 4px;
      text-align: center;
    }
    .file-info {
      margin-top: 0.5rem;
      color: #28a745;
    }
    .sub-fields {
      margin-top: 1rem;
      padding: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      background-color: #f8f9fa;
    }
    .validation-errors {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class DynamicFieldComponent implements OnInit {
  @Input() field!: FormField;
  @Input() formGroup!: FormGroup;
  @Input() formData: any = {};
  @Output() fieldChange = new EventEmitter<{ fieldName: string, value: any }>();

  lookupOptions: LookupOption[] = [];
  selectedFile: File | null = null;

  constructor(private dynamicFormService: DynamicFormService) {}

  ngOnInit(): void {
    if (this.field.field_type === 'choice' && this.field.lookup) {
      this.loadLookupOptions();
    }
  }

  loadLookupOptions(): void {
    if (this.field.allowed_lookups && this.field.allowed_lookups.length > 0) {
      this.lookupOptions = this.field.allowed_lookups;
    } else if (this.field.lookup) {
      this.dynamicFormService.getLookupData(this.field.lookup).subscribe({
        next: (response) => {
          this.lookupOptions = response.results.filter(option => option.active_ind);
        },
        error: (error) => {
          console.error('Error loading lookup options:', error);
        }
      });
    }
  }

  getNumberStep(): string {
    if (this.field.field_type === 'percentage') return '0.01';
    if (this.field.precision) return `0.${'0'.repeat(this.field.precision - 1)}1`;
    if (this.field.integer_only) return '1';
    return 'any';
  }

  getAcceptedFileTypes(): string {
    if (this.field.file_types && this.field.file_types.length > 0) {
      return this.field.file_types.map(type => `.${type}`).join(',');
    }
    return '*/*';
  }

  onValueChange(event: any): void {
    let value = event.target.value;

    // Type conversion
    if (this.field.field_type === 'number' || this.field.field_type === 'decimal' || this.field.field_type === 'percentage') {
      value = event.target.value ? Number(event.target.value) : null;
    } else if (this.field.field_type === 'boolean') {
      value = event.target.checked;
    }

    this.fieldChange.emit({ fieldName: this.field.name, value });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fieldChange.emit({ fieldName: this.field.name, value: file });
    }
  }

  onFieldChange(event: { fieldName: string, value: any }): void {
    this.fieldChange.emit(event);
  }
}
