import { Component, OnInit, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameCard as GameCardComponent } from '../../shared/components/game-card/game-card';
import { GameCard } from '../../shared/components/game-card/models/game-card.model';
import { GameCardService } from '../../shared/components/game-card/services/game-card.service';
import { Icon } from '../../shared/components/icon/icon';

interface Provider {
  id: string;
  name: string;
  gamesCount: number;
}

@Component({
  selector: 'app-search',
  imports: [FormsModule, GameCardComponent, Icon],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  searchQuery = signal<string>('');
  allGames = signal<GameCard[]>([]);
  recentSearches = signal<string[]>([]);
  
  topProviders: Provider[] = [
    { id: 'pragmatic-play', name: 'Pragmatic Play', gamesCount: 245 },
    { id: 'evolution', name: 'Evolution Gaming', gamesCount: 180 },
    { id: 'netent', name: 'NetEnt', gamesCount: 156 },
    { id: 'playgo', name: "Play'n GO", gamesCount: 132 }
  ];

  searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    return this.allGames().filter(game => 
      game.name.toLowerCase().includes(query) ||
      game.provider.toLowerCase().includes(query) ||
      game.category?.toLowerCase().includes(query)
    );
  });

  constructor(
    private gameCardService: GameCardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGames();
    this.loadRecentSearches();
  }

  private loadGames(): void {
    this.gameCardService.getGames().subscribe(games => {
      this.allGames.set(games);
    });
  }

  private loadRecentSearches(): void {
    if (!this.isBrowser) {
      this.recentSearches.set(['Sweet Bonanza', 'Aviator', 'Pragmatic Play']);
      return;
    }
    
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      this.recentSearches.set(JSON.parse(stored));
    } else {
      this.recentSearches.set(['Sweet Bonanza', 'Aviator', 'Pragmatic Play']);
    }
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query && this.searchResults().length > 0) {
      this.addToRecentSearches(query);
    }
  }

  selectRecentSearch(search: string): void {
    this.searchQuery.set(search);
    this.onSearch();
  }

  removeRecentSearch(search: string, event: Event): void {
    event.stopPropagation();
    const updated = this.recentSearches().filter(s => s !== search);
    this.recentSearches.set(updated);
    if (this.isBrowser) {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  }

  selectProvider(provider: Provider): void {
    this.searchQuery.set(provider.name);
    this.onSearch();
  }

  private addToRecentSearches(search: string): void {
    let recent = this.recentSearches();
    recent = [search, ...recent.filter(s => s !== search)].slice(0, 5);
    this.recentSearches.set(recent);
    if (this.isBrowser) {
      localStorage.setItem('recentSearches', JSON.stringify(recent));
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}
