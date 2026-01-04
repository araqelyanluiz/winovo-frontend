import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { AppConfig } from '../../../shared/models/app-config.model';
import { environment } from '../../../../environments/environment';
import defaultConfig from './default-config.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly configSignal = signal<AppConfig | null>(null);

  readonly config = this.configSignal.asReadonly();

  loadConfig(): Observable<AppConfig> {
    // If no configUrl is provided, use default config
    if (!environment.configUrl) {
      this.configSignal.set(defaultConfig as AppConfig);
      return of(defaultConfig as AppConfig);
    }
    
    return this.http.get<AppConfig>(environment.configUrl).pipe(
      tap(config => this.configSignal.set(config))
    );
  }

  getConfig(): AppConfig | null {
    return this.configSignal();
  }

  getTheme() {
    return this.configSignal()?.theme;
  }

  getFeatures() {
    return this.configSignal()?.features;
  }

  getSEO() {
    return this.configSignal()?.seo;
  }

  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.configSignal()?.features[feature] ?? false;
  }
}
