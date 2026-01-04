import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ConfigService } from './core/services/config/config.service';
import { ThemeService } from './core/services/theme/theme.service';
import { LocalizationService } from './core/services/localization/localization.service';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Observable } from 'rxjs';
import { inject } from '@angular/core';

export class CustomTranslateLoader implements TranslateLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}

function initializeApp(
  configService: ConfigService, 
  themeService: ThemeService, 
  localizationService: LocalizationService,
  title: Title, 
  meta: Meta
) {
  return () => firstValueFrom(configService.loadConfig()).then(config => {
    title.setTitle(config.seo.title);
    meta.updateTag({ name: 'description', content: config.seo.description });
    meta.updateTag({ name: 'keywords', content: config.seo.keywords.join(', ') });
    themeService.initialize();
    localizationService.initialize();
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: CustomTranslateLoader
        }
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService, ThemeService, LocalizationService, Title, Meta],
      multi: true
    }
  ]
};
