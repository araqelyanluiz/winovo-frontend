import { Component, OnInit, inject, signal } from '@angular/core';
import { PromoCarousel } from '../../shared/components/promo-carousel/promo-carousel';
import { PromoSlide } from '../../shared/components/promo-carousel/models/promo-carousel.model';
import { GameService } from '../../core/services/game/game.service';
import { Game } from '../../core/services/game/game.model';
import { Icon } from '../../shared/components/icon/icon';
import { GlobalSlider } from '../../shared/components/global-slider/global-slider';
import { GameCard } from '../../shared/components/game-card/game-card';
import { RouterLink } from "@angular/router";

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
      backgroundImage: 'url(/assets/images/banners/banner1.png)',
    },
    {
      backgroundImage: 'url(/assets/images/banners/banner2.png)',
    },
    {
      backgroundImage: 'url(/assets/images/banners/banner3.png)',
    },
  ];
  constructor() {}

  ngOnInit(): void {
    this.getGames();
    this.getTopGames();
    this.getNewGames();
    this.getHotGames();
  }

  private getGames(): void {
    this.gameService.getGames(1, 40).subscribe({
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

  private getTopGames():void {
    const topGames = this.gameService.getGamesByTagType('top');
    this.topGames.set(topGames.slice(0, 20));
    this.isLoadingTopGames.set(false);
  }

  private getNewGames():void {
    const newGames = this.gameService.getGamesByTagType('new');
    this.newGames.set(newGames.slice(0, 20));
    this.isLoadingNewGames.set(false);
  }

  private getHotGames():void {
    const hotGames = this.gameService.getGamesByTagType('hot');
    this.hotGames.set(hotGames.slice(0, 20));
    this.isLoadingHotGames.set(false);
  }

}
