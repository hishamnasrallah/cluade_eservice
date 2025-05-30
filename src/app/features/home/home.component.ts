// home.component.ts
import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-layout">
      <header class="app-header">
        <div class="header-content">
          <h1>Dynamic Forms Portal</h1>
          <nav class="main-nav">
            <a routerLink="/home/applications" routerLinkActive="active">My Applications</a>
            <a routerLink="/home/services" routerLinkActive="active">Services</a>
          </nav>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  imports: [
    RouterOutlet
  ],
  styles: [`
    .home-layout {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .app-header {
      background-color: #343a40;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .main-nav {
      display: flex;
      gap: 2rem;
    }

    .main-nav a {
      color: #adb5bd;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .main-nav a:hover,
    .main-nav a.active {
      color: white;
      background-color: #495057;
    }

    .logout-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }

    .logout-btn:hover {
      background-color: #c82333;
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
  `]
})
export class HomeComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
