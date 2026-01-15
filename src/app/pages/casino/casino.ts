import { Component, inject, OnInit, signal } from '@angular/core';
import { Game, Provider } from '../../core/services/game/game.model';
import { GameService } from '../../core/services/game/game.service';
import { Icon } from "../../shared/components/icon/icon";
import { GameCard } from "../../shared/components/game-card/game-card";

@Component({
  selector: 'app-casino',
  imports: [Icon, GameCard],
  templateUrl: './casino.html',
  styleUrl: './casino.css',
})
export class Casino implements OnInit {
  private readonly gameService = inject(GameService);

  protected readonly games = signal<Game[]>([]);
  protected readonly providers = signal<Provider[]>([]);
  protected readonly selectedProvider = signal<string>('All');
  protected readonly filteredGames = signal<Game[]>([]);

  ngOnInit(): void {
    this.getGames();
    this.getProviders();
  }

  private getGames(): void {
    this.gameService.getGames().subscribe({
      next: (games) => {
        this.games.set(games);
        this.filteredGames.set(games);
      },
      error: (error) => {
        console.error('Error fetching games:', error);
      },
    });
  }

  private getProviders(): void {
    this.gameService.getProviders().subscribe({
      next: (providers) => {
        this.providers.set(providers);
      },
      error: (error) => {
        console.error('Error fetching providers:', error);
      },
    });
  }

  protected selectProvider(providerName: string): void {
    this.selectedProvider.set(providerName);
    if (providerName === 'All') {
      this.filteredGames.set(this.games());
    } else {
      this.filteredGames.set(
        this.games().filter(game => game.type === providerName)
      );
    }
  }
}
