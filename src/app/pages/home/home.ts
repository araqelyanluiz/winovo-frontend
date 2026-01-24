import { Component, OnInit, inject, signal } from '@angular/core';
import { PromoCarousel } from '../../shared/components/promo-carousel/promo-carousel';
import { PromoSlide } from '../../shared/components/promo-carousel/models/promo-carousel.model';
import { GameService } from '../../core/services/game/game.service';
import { Game } from '../../core/services/game/game.model';
import { Icon } from '../../shared/components/icon/icon';
import { GlobalSlider } from '../../shared/components/global-slider/global-slider';
import { GameCard } from '../../shared/components/game-card/game-card';
import { RouterLink } from "@angular/router";
import { VersionManager } from '../../core/services/version/version-manager';

@Component({
  selector: 'app-home',
  imports: [PromoCarousel, Icon, GlobalSlider, GameCard, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly gameService = inject(GameService);

  protected readonly games = signal<Game[]>([]);
  protected readonly topGames = signal<Game[]>([]);
  protected readonly newGames = signal<Game[]>([]);
  protected readonly hotGames = signal<Game[]>([]);
  protected readonly isLoadingGames = signal<boolean>(true);
  protected readonly isLoadingTopGames = signal<boolean>(true);
  protected readonly isLoadingNewGames = signal<boolean>(true);
  protected readonly isLoadingHotGames = signal<boolean>(true);

  // Carousel configuration
  carouselAutoplay = true;
  carouselAutoplayMs = 5000;
  carouselPeekPx = 32;

  carouselSlides: PromoSlide[] = [
    {
      backgroundImage: `url(${VersionManager.getVersionedUrl('/assets/images/banners/banner1.png')})`,
    },
    {
      backgroundImage: `url(${VersionManager.getVersionedUrl('/assets/images/banners/banner2.png')})`,
    },
    {
      backgroundImage: `url(${VersionManager.getVersionedUrl('/assets/images/banners/banner3.png')})`,
    },
  ];

  ngOnInit(): void {
    this.getGames();
    this.getTopGames();
    this.getNewGames();
    this.getHotGames();
  }

  private getGames(): void {
    this.gameService.getGames(1, 30).subscribe({
      next: (response) => {
        this.games.set(response.result);
        this.isLoadingGames.set(false);
      },
      error: (error: Error) => {
        console.error('Failed to load games:', error);
        this.isLoadingGames.set(false);
      }
    });
  }

  private getTopGames(): void {
    this.gameService.getGamesByTag('top', 10).subscribe({
      next: (response) => {
        this.topGames.set(response.result);
        this.isLoadingTopGames.set(false);
      },
      error: (error: Error) => {
        console.error('Failed to load top games:', error);
        this.isLoadingTopGames.set(false);
      }
    });
  }

  private getNewGames(): void {
    this.gameService.getGamesByTag('new', 10).subscribe({
      next: (response) => {
        this.newGames.set(response.result);
        this.isLoadingNewGames.set(false);
      },
      error: (error: Error) => {
        console.error('Failed to load new games:', error);
        this.isLoadingNewGames.set(false);
      }
    });
  }

  private getHotGames(): void {
    this.gameService.getGamesByTag('hot', 10).subscribe({
      next: (response) => {
        this.hotGames.set(response.result);
        this.isLoadingHotGames.set(false);
      },
      error: (error: Error) => {
        console.error('Failed to load hot games:', error);
        this.isLoadingHotGames.set(false);
      }
    });
  }

}
