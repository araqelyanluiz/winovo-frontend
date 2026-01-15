import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '../../shared/components/icon/icon';
import { Provider, Game } from '../../core/services/game/game.model';
import { GameService } from '../../core/services/game/game.service';
import { GameCard } from '../../shared/components/game-card/game-card';

@Component({
  selector: 'app-search',
  imports: [FormsModule, Icon, GameCard],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private readonly gameService = inject(GameService);

  protected searchQuery = '';
  protected recentSearches = signal<string[]>(['Sweet Bonanza', 'Gates of Olympus', 'Pragmatic Play']);
  protected providers = signal<Provider[]>([]);
  protected allGames = signal<Game[]>([]);
  protected searchResults = signal<Game[]>([]);
  protected isSearching = signal<boolean>(false);

  ngOnInit(): void {
    this.getProviders();
    this.getGames();
  }

  private getProviders(): void {
    this.gameService.getProviders().subscribe({
      next: (providers) => {
        this.providers.set(providers.slice(0, 4));
      },
      error: (error) => {
        console.error('Error fetching providers:', error);
      },
    });
  }

  private getGames(): void {
    this.gameService.getGames().subscribe({
      next: (games) => {
        this.allGames.set(games);
      },
      error: (error) => {
        console.error('Error fetching games:', error);
      },
    });
  }

  protected onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      this.isSearching.set(true);
      const results = this.allGames().filter(game => 
        game.name.toLowerCase().includes(query) || 
        game.type.toLowerCase().includes(query)
      );
      this.searchResults.set(results);
    } else {
      this.isSearching.set(false);
      this.searchResults.set([]);
    }
  }

  protected selectRecentSearch(search: string): void {
    this.searchQuery = search;
    this.onSearch();
  }
}
