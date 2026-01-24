import { Component, inject, OnInit, signal, computed, ViewChild, ElementRef, AfterViewInit, OnDestroy, afterNextRender } from '@angular/core';
import { Game, Provider } from '../../core/services/game/game.model';
import { GameService } from '../../core/services/game/game.service';
import { Icon } from "../../shared/components/icon/icon";
import { GameCard } from "../../shared/components/game-card/game-card";
import { Loader } from "../../shared/components/loader/loader";

@Component({
  selector: 'app-casino',
  imports: [Icon, GameCard, Loader],
  templateUrl: './casino.html',
  styleUrl: './casino.css',
})
export class Casino implements OnInit, OnDestroy {
  private readonly gameService = inject(GameService);
  private observer?: IntersectionObserver;

  @ViewChild('sentinel', { read: ElementRef }) sentinel?: ElementRef<HTMLElement>;

  protected readonly providers = signal<Provider[]>([]);
  protected readonly selectedProvider = signal<string>('All');
  protected readonly isLoadingMore = signal<boolean>(false);

  protected get totalGames() { return this.gameService.totalGames; }
  protected get isLoading() { return this.gameService.isLoading; }
  protected get hasMoreGames() { return this.gameService.hasMoreGames; }

  protected readonly filteredGames = computed(() => {
    const providerName = this.selectedProvider();
    const allGames = this.gameService.games();
    
    if (providerName === 'All') {
      return allGames;
    } else {
      const provider = this.providers().find(p => p.name === providerName);
      if (provider) {
        return allGames.filter(game => provider.games.includes(game.id));
      }
      return allGames;
    }
  });

  constructor() {
    afterNextRender(() => {
      this.setupIntersectionObserver();
    });
  }

  ngOnInit(): void {
    this.loadGames();
    this.getProviders();
  }

  private loadGames(): void {
    this.gameService.getGames(1, 30).subscribe({
      next: () => {
        // Фильтр обновится автоматически через computed
      },
      error: (error) => {
        console.error('Error fetching games:', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupIntersectionObserver(): void {
    if (!this.sentinel) {
      console.warn('Sentinel element not found');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !this.isLoading() && this.hasMoreGames()) {
          console.log('Loading next page...');
          this.loadNextPage();
        }
      },
      {
        root: null,
        rootMargin: '800px 0px',
        threshold: 0.1,
      }
    );

    this.observer.observe(this.sentinel.nativeElement);
    console.log('IntersectionObserver setup complete');
  }

  private loadNextPage(): void {
    if (this.isLoading() || !this.hasMoreGames()) return;
    this.gameService.loadMoreGames();
  }

  private getProviders(): void {
    this.gameService.getProviders().subscribe({
      next: (providers: Provider[]) => {
        this.providers.set(providers);
      },
      error: (error: Error) => {
        console.error('Error fetching providers:', error);
      },
    });
  }

  protected selectProvider(providerName: string): void {
    this.selectedProvider.set(providerName);
    // Фильтр обновится автоматически через computed
  }
}
