import { Injectable, inject, PLATFORM_ID, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly configService = inject(ConfigService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly config = toSignal(this.configService.config$, { requireSync: true });

  constructor() {
    if (!this.isBrowser) return;

    effect(() => {
      const { theme } = this.config();
      const root = document.documentElement;
      if (theme) {
        Object.entries(theme).forEach(([key, value]) => {
          // Convert "203 168 255" format to "rgb(203 168 255)"
          root.style.setProperty(`--${key}`, `rgb(${value})`);
        });
      }
    });
  }

  initialize(): void {
    // Effect is already set up in constructor
  }
}
