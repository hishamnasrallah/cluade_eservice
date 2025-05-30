// dynamic-form.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule} from '@angular/forms';
import { DynamicFormService } from '../../core/services/dynamic-form.service';
import { FieldCategory, FormField } from '../../core/models/form.model';

@Component({
  selector: 'app-dynamic-form',
  template: `
    <form [formGroup]="dynamicForm" class="dynamic-form">
      <div *ngFor="let category of categories" class="form-category">
        <h3 class="category-title">{{ category.name }}</h3>
        <p *ngIf="category.name_ara" class="category-subtitle">{{ category.name_ara }}</p>

        <div class="fields-container">
          <app-dynamic-field
            *ngFor="let field of getVisibleFields(category.fields)"
            [field]="field"
            [formGroup]="dynamicForm"
            [formData]="formData"
            (fieldChange)="onFieldChange($event)">
          </app-dynamic-field>
        </div>
      </div>
    </form>
  `,
  imports: [
    ReactiveFormsModule
  ],
  styles: [`
    .dynamic-form {
      margin: 1rem 0;
    }

    .form-category {
      margin-bottom: 2rem;
      padding: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      background-color: #f8f9fa;
    }

    .category-title {
      margin: 0 0 0.5rem 0;
      color: #495057;
    }

    .category-subtitle {
      margin: 0 0 1rem 0;
      color: #6c757d;
      font-style: italic;
    }

    .fields-container {
      background-color: white;
      padding: 1rem;
      border-radius: 4px;
    }
  `]
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() categories: FieldCategory[] = [];
  @Input() formData: any = {};
  @Output() formChange = new EventEmitter<any>();
  @Output() validationChange = new EventEmitter<boolean>();

  dynamicForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dynamicFormService: DynamicFormService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(): void {
    if (this.dynamicForm) {
      this.buildForm();
    }
  }

  buildForm(): void {
    const formControls: any = {};

    this.categories.forEach(category => {
      category.fields.forEach(field => {
        if (!field.is_hidden) {
          formControls[field.name] = this.createFormControl(field);
        }
      });
    });

    this.dynamicForm = this.fb.group(formControls);

    // Watch for form changes
    this.dynamicForm.valueChanges.subscribe(value => {
      this.formData = { ...this.formData, ...value };
      this.formChange.emit(this.formData);
      this.validationChange.emit(this.dynamicForm.valid);
    });

    // Initial validation
    this.validationChange.emit(this.dynamicForm.valid);
  }

  createFormControl(field: FormField): AbstractControl {
    const validators = [];

    if (field.mandatory) {
      validators.push(Validators.required);
    }

    if (field.field_type === 'text') {
      if (field.min_length) {
        validators.push(Validators.minLength(field.min_length));
      }
      if (field.max_length) {
        validators.push(Validators.maxLength(field.max_length));
      }
      if (field.regex_pattern) {
        validators.push(Validators.pattern(field.regex_pattern));
      }
    }

    if (field.field_type === 'number' || field.field_type === 'decimal') {
      if (field.value_greater_than !== undefined) {
        validators.push(Validators.min(field.value_greater_than));
      }
      if (field.value_less_than !== undefined) {
        validators.push(Validators.max(field.value_less_than));
      }
    }

    const initialValue = this.getInitialValue(field);
    return this.fb.control(initialValue, validators);
  }

  getInitialValue(field: FormField): any {
    if (field.field_type === 'boolean') {
      return field.default_boolean || false;
    }
    return this.formData[field.name] || '';
  }

  getVisibleFields(fields: FormField[]): FormField[] {
    return fields.filter(field => {
      if (field.is_hidden) return false;

      if (field.visibility_conditions && field.visibility_conditions.length > 0) {
        return this.dynamicFormService.evaluateCondition(
          field.visibility_conditions,
          this.formData
        );
      }

      return true;
    });
  }

  onFieldChange(event: { fieldName: string, value: any }): void {
    this.formData[event.fieldName] = event.value;
    this.formChange.emit(this.formData);
  }
}
