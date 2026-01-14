import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import defaultConfig from './default-config.json';
import { environment } from '../../../../environments/environment';
import { AppConfig } from './app-config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly configSubject = new BehaviorSubject<AppConfig>(
    defaultConfig as unknown as AppConfig
  );
  readonly config$ = this.configSubject.asObservable();

  loadConfig(): Observable<AppConfig> {
    // If no configUrl is provided, use default config
    if (!environment.configUrl) {
      return of(this.configSubject.value);
    }

    return this.http.get<AppConfig>(environment.configUrl).pipe(
      tap(config => this.configSubject.next(config)),
      catchError(error => {
        console.error('Failed to load config:', error);
        return of(this.configSubject.value);
      })
    );
  }

  getConfig(): AppConfig {
    return this.configSubject.value;
  }
}
