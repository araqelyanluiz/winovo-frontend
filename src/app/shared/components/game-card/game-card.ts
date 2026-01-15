import { Component, input, effect } from '@angular/core';
import { Game } from '../../../core/services/game/game.model';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-game-card',
  imports: [Icon],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css',
})
export class GameCard {
  game = input<Game>();

  constructor() {
    effect(() => {
      console.log('Game:', this.game());
    });
  }
}
