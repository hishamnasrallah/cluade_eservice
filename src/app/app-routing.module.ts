// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ConfigComponent } from './features/config/config.component';
import { LoginComponent } from './features/auth/login.component';
import { HomeComponent } from './features/home/home.component';
import { ApplicationsComponent } from './features/applications/applications.component';
import { ServicesComponent } from './features/services/services.component';
import { ServiceWizardComponent } from './features/service-wizard/service-wizard.component';

const routes: Routes = [
  { path: '', redirectTo: '/config', pathMatch: 'full' },
  { path: 'config', component: ConfigComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'applications', pathMatch: 'full' },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'services', component: ServicesComponent },
    ]
  },
  { path: 'service-wizard/:serviceId', component: ServiceWizardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/config' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
