import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { TelegramUser } from './telegram-user.model';
import { TelegramWebApp, LoadUserRequest } from './telegram-webapp.model';

@Injectable({ providedIn: 'root' })
export class TelegramAuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  readonly user = signal<TelegramUser | null>(null);
  readonly isAuthenticated = computed(() => this.user() !== null);
  
  private webApp: TelegramWebApp | null = null;
  private loadUserRequest$: Observable<boolean> | null = null;

  get isInitialized(): boolean {
    return !!this.webApp;
  }

  initialize(): void {
    if (this.webApp || !this.isBrowser) {
      return;
    }

    const telegramWebApp = window?.Telegram?.WebApp;
    if (telegramWebApp) {
      this.webApp = telegramWebApp;
      this.webApp.ready();
      this.webApp.expand();
    }
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
      `${environment.apiUrl}/user`,
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