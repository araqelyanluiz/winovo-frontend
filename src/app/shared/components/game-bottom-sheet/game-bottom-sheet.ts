import { Component, signal, inject, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GameService } from '../../../core/services/game/game.service';
import { Game } from '../../../core/services/game/game.model';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-game-bottom-sheet',
  standalone: true,
  imports: [Icon],
  templateUrl: './game-bottom-sheet.html',
  styleUrl: './game-bottom-sheet.css',
})
export class GameBottomSheet {
  private readonly gameService = inject(GameService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  protected isOpen = signal<boolean>(false);
  protected game = signal<Game | null>(null);
  protected isDemo = signal<boolean>(false);
  protected startY = signal<number>(0);
  protected currentY = signal<number>(0);
  protected isDragging = signal<boolean>(false);

  constructor() {
    effect(() => {
      const state = this.gameService.gameBottomSheetState();
      this.isOpen.set(state.isOpen);
      this.game.set(state.game);
      this.isDemo.set(state.isDemo);
    });

    effect(() => {
      if (this.isBrowser) {
        if (this.isOpen()) {
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
        } else {
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
        }
      }
    });
  }

  onTouchStart(event: TouchEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.tagName === 'BUTTON') {
      return;
    }
    this.startY.set(event.touches[0].clientY);
    this.isDragging.set(true);
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging()) return;
    
    const deltaY = event.touches[0].clientY - this.startY();
    if (deltaY > 0) {
      this.currentY.set(deltaY);
      event.preventDefault();
    }
  }

  onTouchEnd(): void {
    if (this.currentY() > 100) {
      this.close();
    }
    this.currentY.set(0);
    this.isDragging.set(false);
  }

  close(): void {
    this.gameService.closeGameBottomSheet();
  }

  playGame(): void {
    const currentGame = this.game();
    if (currentGame) {
      this.gameService.openGameLaunchDialog(currentGame, false);
      this.close();
    }
  }

  playDemo(): void {
    const currentGame = this.game();
    if (currentGame) {
      this.gameService.openGameLaunchDialog(currentGame, true);
      this.close();
    }
  }
}
