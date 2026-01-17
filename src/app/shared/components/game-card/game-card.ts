import { Component, input, signal } from '@angular/core';
import { Game } from '../../../core/services/game/game.model';
import { Icon } from '../icon/icon';
import { GameLaunchDialog } from '../game-launch-dialog/game-launch-dialog';

@Component({
  selector: 'app-game-card',
  imports: [Icon, GameLaunchDialog],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css',
})
export class GameCard {
  game = input<Game>();
  
  protected readonly isDialogOpen = signal<boolean>(false);
  protected readonly selectedGame = signal<Game | null>(null);
  protected readonly isDemoMode = signal<boolean>(false);

  initGame(): void {
    const currentGame = this.game();
    if (!currentGame) return;
    
    this.isDemoMode.set(false);
    this.selectedGame.set(currentGame);
    this.isDialogOpen.set(true);
  }

  initDemo(): void {
    const currentGame = this.game();
    if (!currentGame) return;
    
    this.isDemoMode.set(true);
    this.selectedGame.set(currentGame);
    this.isDialogOpen.set(true);
  }

  closeDialog(): void {
    this.isDialogOpen.set(false);
    this.selectedGame.set(null);
    this.isDemoMode.set(false);
  }
}
