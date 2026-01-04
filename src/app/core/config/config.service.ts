import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly configSignal = signal<Config | null>(null);

  readonly config = this.configSignal.asReadonly();

  loadConfig(): Observable<Config> {
    return this.http.get<Config>('/assets/config/config.json').pipe(
      tap(config => this.configSignal.set(config))
    );
  }

  getConfig(): Config | null {
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

  isFeatureEnabled(feature: keyof Config['features']): boolean {
    return this.configSignal()?.features[feature] ?? false;
  }
}
