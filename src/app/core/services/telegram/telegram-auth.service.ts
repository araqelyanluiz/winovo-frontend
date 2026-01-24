import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { TelegramUser } from './telegram-user.model';
import { TelegramWebApp, LoadUserRequest } from './telegram-webapp.model';

@Injectable({ providedIn: 'root' })
export class TelegramAuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private API_URL = environment.apiUrl;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  readonly user = signal<TelegramUser | null>(null);
  readonly isAuthenticated = computed(() => this.user() !== null);
  
  private webApp: TelegramWebApp | null = null;
  private loadUserRequest$: Observable<boolean> | null = null;

  get isInitialized(): boolean {
    return !!this.webApp;
  }

  initialize(): Promise<boolean> {
    console.log('TelegramAuth: initialize() called');
    
    if (!this.isBrowser) {
      console.log('TelegramAuth: not browser platform');
      return Promise.resolve(false);
    }

    if (this.user()) {
      console.log('TelegramAuth: user already loaded');
      return Promise.resolve(true);
    }

    const telegramWebApp = window?.Telegram?.WebApp;
    console.log('TelegramAuth: Telegram WebApp available:', !!telegramWebApp);
    
    if (telegramWebApp && !this.webApp) {
      this.webApp = telegramWebApp;
      this.webApp.ready();
      this.webApp.expand();
    }
    
    const webAppUser = this.webApp?.initDataUnsafe?.user;
    console.log('TelegramAuth: WebApp User:', webAppUser);
    
    let telegramId: number | undefined;
    let username: string | undefined;

    if (webAppUser?.id) {
      telegramId = webAppUser.id;
      username = webAppUser.username;
      console.log('TelegramAuth: Using Telegram WebApp user');
    } else if (environment.testUser) {
      telegramId = environment.testUser.telegramId;
      username = environment.testUser.username;
      console.log('TelegramAuth: Using test user in development mode');
    } else {
      console.warn('TelegramAuth: No Telegram user available, redirecting to 404');
      if (this.isBrowser) {
        this.router.navigate(['/404']);
      }
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      console.log('TelegramAuth: Loading user from backend...');
      this.loadUserFromBackend(telegramId, username).subscribe({
        next: (success) => {
          resolve(success && !!this.user());
        },
        error: (err) => {
          console.error('TelegramAuth: Error loading user from backend:', err);
          resolve(false);
        }
      });
    });
  }

  loadUserFromBackend(telegramId?: number, username?: string): Observable<boolean> {
    const webAppUser = this.webApp?.initDataUnsafe?.user;
    const userId = telegramId ?? webAppUser?.id;
    
    if (!userId) {
      return of(false);
    }

    if (this.loadUserRequest$) {
      return this.loadUserRequest$;
    }

    const requestBody: LoadUserRequest = {
      telegramId: userId,
      username: username ?? webAppUser?.username,
    };
    
    this.loadUserRequest$ = this.http.post<TelegramUser>(
      `${this.API_URL}/user`,
      requestBody
    ).pipe(
      tap(response => this.user.set(response)),
      map(() => true),
      catchError((error) => {
        console.error('Failed to load user:', error);
        return of(false);
      }),
      shareReplay(1)
    );

    return this.loadUserRequest$;
  }

  getWebApp(): TelegramWebApp | null {
    return this.webApp;
  }

  getInitData(): string {
    return this.webApp?.initData ?? '';
  }

  isAvailable(): boolean {
    return this.isBrowser && !!window?.Telegram?.WebApp;
  }

  clearUser(): void {
    this.user.set(null);
    this.loadUserRequest$ = null;
  }
}