// config.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private baseUrlSubject = new BehaviorSubject<string>('');
  public baseUrl$ = this.baseUrlSubject.asObservable();

  constructor() {
    const savedUrl = localStorage.getItem('baseUrl');
    if (savedUrl) {
      this.baseUrlSubject.next(savedUrl);
    }
  }

  setBaseUrl(url: string): void {
    localStorage.setItem('baseUrl', url);
    this.baseUrlSubject.next(url);
  }

  getBaseUrl(): string {
    return this.baseUrlSubject.value;
  }
}
