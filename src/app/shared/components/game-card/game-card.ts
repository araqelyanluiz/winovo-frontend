import { Component, input, inject } from '@angular/core';
import { Game } from '../../../core/services/game/game.model';
import { Icon } from '../icon/icon';
import { GameService } from '../../../core/services/game/game.service';

@Component({
  selector: 'app-game-card',
  imports: [Icon],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css',
})
export class GameCard {
  private readonly gameService = inject(GameService);
  
  game = input<Game>();

  initGame(): void {
    const currentGame = this.game();
    if (!currentGame) return;

    this.gameService.gameInit(currentGame.id).subscribe({
      next: (response) => {
        if (response) {    
          console.log(response)
          // window.open(response.launchUrl, '_blank');
        } else {
          console.error('Invalid launch URL');
        } 
      },
      error: (error) => {
        console.error('Error launching game:', error);
      },
    });
  }

  initDemo(): void {
    alert('Launching demo...');
  }
}
