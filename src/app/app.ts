import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizationService } from './core/services/localization/localization.service';
import { CommonModule } from '@angular/common';
import { Header } from './layout/header/header';
import { Navigation } from './layout/navigation/navigation';
import { Footer } from './layout/footer/footer';
import { Language } from './core/services/config/app-config.model';
import { GameBottomSheet } from './shared/components/game-bottom-sheet/game-bottom-sheet';
import { GameLaunchDialog } from './shared/components/game-launch-dialog/game-launch-dialog';
import { GameService } from './core/services/game/game.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, CommonModule, GameBottomSheet, GameLaunchDialog],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('winovo-frontend');
  protected readonly localizationService = inject(LocalizationService);
  protected readonly gameService = inject(GameService);
  protected readonly showLangMenu = signal(false);
  
  readonly launchDialogState = this.gameService.launchDialogState;
  
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
