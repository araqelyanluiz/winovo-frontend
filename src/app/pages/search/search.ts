import { Component, OnInit, signal, inject, DestroyRef, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly RECENT_SEARCHES_KEY = 'winovo_search_history';

  protected searchQuery = '';
  protected recentSearches = signal<string[]>([]);
  protected providers = signal<Provider[]>([]);
  protected allGames = signal<Game[]>([]);
  protected searchResults = signal<Game[]>([]);
  protected isSearching = signal<boolean>(false);

  ngOnInit(): void {
    this.loadSavedSearches();
    this.getProviders();
    this.getGames();
  }

  private loadSavedSearches(): void {
    if (!this.isBrowser) return;

    try {
      const saved = localStorage.getItem(this.RECENT_SEARCHES_KEY);
      if (saved) {
        this.recentSearches.set(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  }

  private saveSearchesToStorage(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(this.RECENT_SEARCHES_KEY, JSON.stringify(this.recentSearches()));
    } catch (error) {
      console.error('Error saving searches:', error);
    }
  }

  private getProviders(): void {
    this.gameService.getProviders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (providers) => {
          this.providers.set(providers.slice(0, 4));
        },
        error: (error) => {
          console.error('Error fetching providers:', error);
        },
      });
  }

  private getGames(): void {
    this.gameService.getGames()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.allGames.set(response.result);
          
          if (this.recentSearches().length === 0) {
            this.initializeRecentSearches(response.result);
          }
        },
        error: (error: Error) => {
          console.error('Error fetching games:', error);
        },
      });
  }

  private initializeRecentSearches(games: Game[]): void {
    const initialSearches = games.slice(0, 5).map(game => game.name);
    this.recentSearches.set(initialSearches);
    this.saveSearchesToStorage();
  }

  protected onSearch(): void {
    const query = this.searchQuery.trim();
    if (query.length >= 2) {
      this.isSearching.set(true);
      const lowerQuery = query.toLowerCase();
      const results = this.allGames().filter(game => 
        game.name.toLowerCase().includes(lowerQuery) || 
        game.type.toLowerCase().includes(lowerQuery)
      );
      this.searchResults.set(results);
      
      if (results.length > 0 && results.length < 10) {
        this.addToRecentSearches(query);
      }
    } else {
      this.isSearching.set(false);
      this.searchResults.set([]);
    }
  }

  private addToRecentSearches(query: string): void {
    const current = this.recentSearches();
    const filtered = current.filter(s => s.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, 10);
    this.recentSearches.set(updated);
    this.saveSearchesToStorage();
  }

  protected selectRecentSearch(search: string): void {
    this.searchQuery = search;
    this.onSearch();
  }

  protected clearRecentSearches(): void {
    this.recentSearches.set([]);
    if (!this.isBrowser) return;
    
    try {
      localStorage.removeItem(this.RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing searches:', error);
    }
  }

  protected navigateToProvider(providerName: string): void {
    this.router.navigate(['/casino'], {
      queryParams: { provider: providerName }
    });
  }

  protected clearSearch(): void {
    this.searchQuery = '';
    this.isSearching.set(false);
    this.searchResults.set([]);
  }
}
