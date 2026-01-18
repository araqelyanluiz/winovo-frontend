import { Component, input, signal, inject } from '@angular/core';
import { Game } from '../../../core/services/game/game.model';
import { Icon } from '../icon/icon';
import { GameDialogService } from '../../../core/services/game-dialog/game-dialog.service';

@Component({
  selector: 'app-game-card',
  imports: [Icon],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css',
})
export class GameCard {
  private readonly gameDialogService = inject(GameDialogService);
  
  game = input<Game>();
  protected readonly showButtons = signal<boolean>(false);

  initGame(): void {
    const currentGame = this.game();
    if (!currentGame) return;
    
    this.gameDialogService.openGame(currentGame, false);
  }

  initDemo(): void {
    const currentGame = this.game();
    if (!currentGame) return;
    
    this.gameDialogService.openGame(currentGame, true);
  }

  onCardTouch(): void {
    this.showButtons.set(!this.showButtons());
  }

  onMouseEnter(): void {
    this.showButtons.set(true);
  }

  onMouseLeave(): void {
    this.showButtons.set(false);
  }
}
