import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ConfigService } from './core/services/config/config.service';
import { ThemeService } from './core/services/theme/theme.service';
import { firstValueFrom } from 'rxjs';

function initializeApp(configService: ConfigService, themeService: ThemeService, title: Title, meta: Meta) {
  return () => firstValueFrom(configService.loadConfig()).then(config => {
    title.setTitle(config.seo.title);
    meta.updateTag({ name: 'description', content: config.seo.description });
    meta.updateTag({ name: 'keywords', content: config.seo.keywords.join(', ') });
    themeService.initialize();
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService, ThemeService, Title, Meta],
      multi: true
    }
  ]
};
