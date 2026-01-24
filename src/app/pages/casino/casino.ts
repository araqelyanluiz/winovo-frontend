import { Component, inject, OnInit, signal, computed, ViewChild, ElementRef, AfterViewInit, OnDestroy, afterNextRender } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game, Provider } from '../../core/services/game/game.model';
import { GameService } from '../../core/services/game/game.service';
import { Icon } from "../../shared/components/icon/icon";
import { GameCard } from "../../shared/components/game-card/game-card";
import { Loader } from "../../shared/components/loader/loader";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-casino',
  imports: [Icon, GameCard, Loader,CommonModule],
  templateUrl: './casino.html',
  styleUrl: './casino.css',
})
export class Casino implements OnInit, OnDestroy {
  private readonly gameService = inject(GameService);
  private readonly route = inject(ActivatedRoute);
  private observer?: IntersectionObserver;

  @ViewChild('sentinel', { read: ElementRef }) sentinel?: ElementRef<HTMLElement>;

  protected readonly providers = signal<Provider[]>([]);
  protected readonly selectedProvider = signal<string>('All');
  protected readonly isLoadingMore = signal<boolean>(false);

  protected get totalGames() { return this.gameService.totalGames; }
  protected get isLoading() { return this.gameService.isLoading; }
  protected get hasMoreGames() { return this.gameService.hasMoreGames; }

  protected get filteredGames() {
    return this.gameService.games();
  }

  constructor() {
    afterNextRender(() => {
      this.setupIntersectionObserver();
    });
  }

  ngOnInit(): void {
    this.getProviders();
    
    this.route.queryParams.subscribe(params => {
      const providerFromQuery = params['provider'];
      
      if (providerFromQuery) {
        this.selectedProvider.set(providerFromQuery);
        this.loadGames(providerFromQuery);
      } else {
        this.loadGames();
      }
    });
  }

  private loadGames(providerName?: string): void {
    this.gameService.getGames(1, 30, false, providerName).subscribe({
      next: () => {
        // Games loaded from API
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
    const providerName = this.selectedProvider();
    this.gameService.loadMoreGames(providerName === 'All' ? undefined : providerName);
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
    const provider = providerName === 'All' ? undefined : providerName;
    this.gameService.resetGames(provider);
  }
}
