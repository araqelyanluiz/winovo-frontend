import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initAppVersioning } from './app/core/services/version/version-manager';

initAppVersioning({
  whitelistedKeys: ['winovo_search_history'],
  enableTelegramWebApp: true,
}).then(() => {
  bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
});
