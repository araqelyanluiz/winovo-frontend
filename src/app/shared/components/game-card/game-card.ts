import { Component, input } from '@angular/core';
import { GameCard as GameCardModel } from './models/game-card.model';
import { CommonModule } from '@angular/common';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-game-card',
  imports: [CommonModule,Icon],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css',
})
export class GameCard {
  game = input.required<GameCardModel>();
}
