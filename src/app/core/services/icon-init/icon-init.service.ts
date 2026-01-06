import { Injectable, inject } from '@angular/core';
import { IconRegistry } from '../../../shared/components/icon/icon.registry';

/**
 * Service to register commonly used icons at app startup
 */
@Injectable({
  providedIn: 'root'
})
export class IconInitService {
  private readonly iconRegistry = inject(IconRegistry);

  /**
   * Register icons that should be available immediately (inline SVG)
   * These won't require HTTP requests
   */
  registerCoreIcons(): void {
    // Register frequently used icons inline for better performance
    this.iconRegistry.registerIcons([
      {
        name: 'arrow-right',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
      },
      {
        name: 'arrow-left',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>'
      },
      {
        name: 'check',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
      },
      {
        name: 'alert',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
      }
    ]);
  }

  /**
   * Initialize the icon system
   * Call this in APP_INITIALIZER
   */
  initialize(): void {
    this.registerCoreIcons();
  }
}
