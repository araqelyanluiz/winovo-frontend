import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// Telegram WebApp types
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date?: number;
    hash?: string;
    query_id?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: any;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  ready: () => void;
  expand: () => void;
  close: () => void;
  showAlert: (message: string) => void;
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface AuthResponse {
  exists: boolean;
  userId?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class TelegramAuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  
  private readonly userSubject = new BehaviorSubject<TelegramUser | null>(null);
  readonly user$ = this.userSubject.asObservable();
  
  private webApp: TelegramWebApp | null = null;
  private initialized = false;

  /**
   * Initialize Telegram WebApp and get user data
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }

    // Only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Telegram WebApp can only be initialized in browser');
      return;
    }

    // Check if Telegram WebApp is available
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp;
      
      // Initialize Telegram WebApp
      this.webApp.ready();
      
      // Expand the app to full height
      this.webApp.expand();
      
      // Get user data
      const user = this.webApp.initDataUnsafe?.user;
      if (user) {
        this.userSubject.next(user);
        console.log('Telegram user initialized:', user);
      } else {
        console.warn('No Telegram user data available');
      }
      
      this.initialized = true;
    } else {
      console.warn('Telegram WebApp SDK not loaded');
    }
  }

  /**
   * Get current Telegram user
   */
  getUser(): TelegramUser | null {
    return this.userSubject.value;
  }

  /**
   * Get Telegram user ID
   */
  getUserId(): number | null {
    return this.userSubject.value?.id || null;
  }

  /**
   * Get Telegram WebApp instance
   */
  getWebApp(): TelegramWebApp | null {
    return this.webApp;
  }

  /**
   * Get initialization data (for backend verification)
   */
  getInitData(): string {
    return this.webApp?.initData || '';
  }

  /**
   * Check if user is authenticated and exists in backend
   */
  checkUserExists(): Observable<AuthResponse> {
    const user = this.getUser() || {id:798788716,username:"vahag_t"}; // Mock user for testing
    if (!user || !user.id) {
      return of({ exists: false, message: 'No Telegram user data' });
    }
    
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/user`,
      { 
        telegramId: user.id,
        username: user.username,
      }
    ).pipe(
      tap(response => {
        console.log('User verification response:', response);
      }),
      catchError(error => {
        console.error('Failed to verify user:', error);
        return of({ exists: false, message: 'Verification failed' });
      })
    );
  }

  /**
   * Check if Telegram WebApp is available
   */
  isAvailable(): boolean {
    return isPlatformBrowser(this.platformId) && 
           typeof window !== 'undefined' && 
           !!window.Telegram?.WebApp;
  }
}