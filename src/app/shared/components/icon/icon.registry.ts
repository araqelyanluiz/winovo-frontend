import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { IconConfig } from './models/icon.model';
import { APP_VERSION } from '../../../core/services/version/version-manager';

@Injectable({
  providedIn: 'root'
})
export class IconRegistry {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  private readonly iconCache = new Map<string, SafeHtml>();
  private readonly loadingCache = new Map<string, Observable<SafeHtml>>();

  /**
   * Register an icon from raw SVG string
   */
  registerIcon(name: string, svg: string): void {
    const sanitized = this.sanitizeSvg(svg);
    this.iconCache.set(name, sanitized);
  }

  /**
   * Register multiple icons at once
   */
  registerIcons(icons: IconConfig[]): void {
    icons.forEach(icon => this.registerIcon(icon.name, icon.svg));
  }

  /**
   * Load icon from URL (for dynamic loading)
   */
  registerIconFromUrl(name: string, url: string): Observable<SafeHtml> {
    if (this.iconCache.has(name)) {
      return of(this.iconCache.get(name)!);
    }

    if (this.loadingCache.has(name)) {
      return this.loadingCache.get(name)!;
    }

    if (!this.isBrowser) {
      // During SSR, return empty observable
      return of(this.sanitizer.sanitize(1, '') as SafeHtml);
    }

    const versionedUrl = this.addVersionToUrl(url);
    const loading$ = this.http.get(versionedUrl, { responseType: 'text' }).pipe(
      map(svg => {
        const sanitized = this.sanitizeSvg(svg);
        this.iconCache.set(name, sanitized);
        this.loadingCache.delete(name);
        return sanitized;
      }),
      catchError(error => {
        console.error(`Failed to load icon "${name}" from ${url}:`, error);
        this.loadingCache.delete(name);
        return throwError(() => error);
      }),
      shareReplay(1)
    );

    this.loadingCache.set(name, loading$);
    return loading$;
  }

  /**
   * Get registered icon
   */
  getIcon(name: string): SafeHtml | null {
    return this.iconCache.get(name) || null;
  }

  /**
   * Check if icon is registered
   */
  hasIcon(name: string): boolean {
    return this.iconCache.has(name);
  }

  /**
   * Clear all registered icons
   */
  clearRegistry(): void {
    this.iconCache.clear();
    this.loadingCache.clear();
  }

  /**
   * Add version query parameter to URL for cache busting
   */
  private addVersionToUrl(url: string): string {
    if (!url) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${APP_VERSION}`;
  }

  /**
   * Sanitize SVG and ensure it's safe
   */
  private sanitizeSvg(svg: string): SafeHtml {
    // Remove any script tags or dangerous attributes
    const cleaned = svg
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
    
    return this.sanitizer.bypassSecurityTrustHtml(cleaned);
  }
}
