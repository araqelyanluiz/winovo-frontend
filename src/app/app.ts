import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizationService } from './core/services/localization/localization.service';
import { Language } from './shared/models/app-config.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('winovo-frontend');
  protected readonly localizationService = inject(LocalizationService);
  protected readonly showLangMenu = signal(false);
  
  protected get availableLanguages(): Language[] {
    return this.localizationService.getAvailableLanguages();
  }
  
  protected get currentLanguage(): Language | null {
    return this.localizationService.currentLanguage();
  }
  
  protected changeLanguage(langCode: string): void {
    this.localizationService.setLanguage(langCode);
    this.showLangMenu.set(false);
  }
  
  protected toggleLangMenu(): void {
    this.showLangMenu.update(v => !v);
  }
}
