import { Component, input, signal, inject } from '@angular/core';
import { Game } from '../../../core/services/game/game.model';
import { GameService } from '../../../core/services/game/game.service';
import { VersionedAssetPipe } from '../../pipes/versioned-asset.pipe';

@Component({
  selector: 'app-game-card',
  imports: [VersionedAssetPipe],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css',
})
export class GameCard {
  private readonly gameService = inject(GameService);
  
  game = input<Game>();
  protected readonly showButtons = signal<boolean>(false);

  launchGame(): void {
    this.gameService.openGameBottomSheet(this.game(), false);
  }
}
