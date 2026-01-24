import { Injectable, signal } from '@angular/core';
import { Game } from '../game/game.model';

export interface GameDialogState {
  isOpen: boolean;
  game: Game | null;
  isDemo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameDialogService {
  private state = signal<GameDialogState>({
    isOpen: false,
    game: null,
    isDemo: false
  });

  readonly dialogState = this.state.asReadonly();

  openGame(game: Game, isDemo: boolean = false): void {
    this.state.set({
      isOpen: true,
      game,
      isDemo
    });
  }

  closeDialog(): void {
    this.state.set({
      isOpen: false,
      game: null,
      isDemo: false
    });
  }
}
