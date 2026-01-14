import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../config/config.service';
import { Language } from '../config/app-config.model';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private readonly translateService = inject(TranslateService);
  private readonly configService = inject(ConfigService);

  private readonly currentLanguageSignal = signal<Language | null>(null);
  readonly currentLanguage = this.currentLanguageSignal.asReadonly();

  initialize(): void {
    const config = this.configService.getConfig();
    if (!config?.localization) return;

    const { defaultLanguage, languages } = config.localization;
    
    // Set available languages
    const enabledLanguages = languages
      .filter((lang: Language) => lang.enabled)
      .map((lang: Language) => lang.code);
    
    this.translateService.addLangs(enabledLanguages);
    
    // Set default language
    this.translateService.setDefaultLang(defaultLanguage);
    
    // Check localStorage or use default
    const savedLang = this.getSavedLanguage();
    const langToUse = savedLang && enabledLanguages.includes(savedLang) 
      ? savedLang 
      : defaultLanguage;
    
    this.setLanguage(langToUse);
  }

  setLanguage(langCode: string): void {
    const config = this.configService.getConfig();
    const language = config?.localization.languages.find((l: Language) => l.code === langCode);
    
    if (!language || !language.enabled) return;

    this.translateService.use(langCode);
    this.currentLanguageSignal.set(language);
    this.saveLanguage(langCode);
  }

  getAvailableLanguages(): Language[] {
    const config = this.configService.getConfig();
    return config?.localization.languages.filter((l: Language) => l.enabled) || [];
  }

  getCurrentLanguageCode(): string {
    return this.translateService.currentLang || this.translateService.defaultLang || 'en';
  }

  translate(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }

  private getSavedLanguage(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('selectedLanguage');
  }

  private saveLanguage(langCode: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('selectedLanguage', langCode);
  }
}
