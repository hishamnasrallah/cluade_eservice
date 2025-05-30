// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Core
import { ApiInterceptor } from './core/interceptors/api.interceptor';

// Components
import { ConfigComponent } from './features/config/config.component';
import { LoginComponent } from './features/auth/login.component';
import { HomeComponent } from './features/home/home.component';
import { ApplicationsComponent } from './features/applications/applications.component';
import { ServicesComponent } from './features/services/services.component';
import { ServiceWizardComponent } from './features/service-wizard/service-wizard.component';
import { DynamicFormComponent } from './shared/components/dynamic-form/dynamic-form.component';
import { DynamicFieldComponent } from './shared/components/field-components/dynamic-field.component';

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppComponent,
    ConfigComponent,
    LoginComponent,
    HomeComponent,
    ApplicationsComponent,
    ServicesComponent,
    ServiceWizardComponent,
    DynamicFormComponent,
    DynamicFieldComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
