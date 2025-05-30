// dynamic-form.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ServiceFlow, LookupResponse } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor(private apiService: ApiService) {}

  getServiceFlow(serviceId: string): Observable<ServiceFlow> {
    return this.apiService.get<ServiceFlow>(`/dynamic/service_flow/?service=["${serviceId}"]`);
  }

  getLookupData(parentId?: number, name?: string): Observable<LookupResponse> {
    const params: any = {};
    if (parentId) params.parent_lookup = parentId;
    if (name) params.name = name;
    return this.apiService.get<LookupResponse>('/lookups/', params);
  }

  submitCase(caseData: any, files?: File[]): Observable<any> {
    if (files && files.length > 0) {
      const formData = new FormData();

      // Add case data
      Object.keys(caseData).forEach(key => {
        if (key !== 'files') {
          formData.append(key, JSON.stringify(caseData[key]));
        }
      });

      // Add files
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      return this.apiService.postFormData('/case/cases/', formData);
    } else {
      return this.apiService.post('/case/cases/', caseData);
    }
  }

  evaluateCondition(condition: any, formData: any): boolean {
    if (!condition || !condition.length) return true;

    return condition.every((rule: any) => {
      if (rule.operation === 'and') {
        return rule.conditions.every((subRule: any) =>
          this.evaluateSingleCondition(subRule, formData)
        );
      } else if (rule.operation === 'or') {
        return rule.conditions.some((subRule: any) =>
          this.evaluateSingleCondition(subRule, formData)
        );
      } else {
        return this.evaluateSingleCondition(rule, formData);
      }
    });
  }

  private evaluateSingleCondition(rule: any, formData: any): boolean {
    const fieldValue = formData[rule.field];
    const compareValue = typeof rule.value === 'object' && rule.value.field
      ? formData[rule.value.field]
      : rule.value;

    switch (rule.operation) {
      case '=':
        return fieldValue == compareValue;
      case '!=':
        return fieldValue != compareValue;
      case '>':
        return Number(fieldValue) > Number(compareValue);
      case '<':
        return Number(fieldValue) < Number(compareValue);
      case '>=':
        return Number(fieldValue) >= Number(compareValue);
      case '<=':
        return Number(fieldValue) <= Number(compareValue);
      case 'contains':
        return String(fieldValue).includes(String(compareValue));
      case 'startswith':
        return String(fieldValue).startsWith(String(compareValue));
      case 'endswith':
        return String(fieldValue).endsWith(String(compareValue));
      case 'in':
        return Array.isArray(compareValue) && compareValue.includes(fieldValue);
      case 'not in':
        return Array.isArray(compareValue) && !compareValue.includes(fieldValue);
      default:
        return true;
    }
  }
}
