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

  // Carousel configuration
  carouselAutoplay = true;
  carouselAutoplayMs = 5000;
  carouselPeekPx = 32;

  carouselSlides: PromoSlide[] = [
    {
      id: 'vip-program',
      badge: 'EXCLUSIVE',
      title: 'VIP Program',
      subtitle: 'Unlock rewards & 20% cashback',
      cta: 'Join Now',
      theme: 'vip',
      icon: 'crown'
    },
    {
      id: 'welcome-bonus',
      badge: 'NEW PLAYER',
      title: 'Welcome Bonus',
      subtitle: '100% bonus up to $500',
      cta: 'Claim Now',
      theme: 'welcome',
      icon: 'gift'
    },
    {
      id: 'crypto-boost',
      badge: 'HOT OFFER',
      title: 'Crypto Boost',
      subtitle: 'Extra 25% on crypto deposits',
      cta: 'Deposit',
      theme: 'crypto',
      icon: 'btc'
    },
    {
      id: 'tournament',
      badge: 'LIVE NOW',
      title: 'Weekly Tournament',
      subtitle: '$10,000 prize pool',
      cta: 'Play Now',
      theme: 'vip',
      icon: 'crown'
    },
    {
      id: 'free-spins',
      badge: 'LIMITED TIME',
      title: 'Free Spins',
      subtitle: '50 free spins on slots',
      cta: 'Get Spins',
      theme: 'welcome',
      icon: 'gift'
    }
  ];
  constructor() {}

  ngOnInit(): void {
    this.getGames();
    this.getTopGames();
    this.getNewGames();
    this.getHotGames();
  }

  private getGames(): void {
    this.gameService.getGames().subscribe({
      next: (games) => {
        this.games.set(games.slice(0, 40));
        this.isLoadingGames.set(false);
      },
      error: (error) => {
        console.error('Failed to load games:', error);
        this.isLoadingGames.set(false);
      }
    });
  }

  private getTopGames():void {
    this.gameService.getGamesByTagType('top').subscribe({
      next: (topGames) => {
        this.topGames.set(topGames.slice(0, 20));
      },
      error: (error) => {
        console.error('Failed to load games:', error);
        this.isLoadingGames.set(false);
      }
    })
  }

  private getNewGames():void {
    this.gameService.getGamesByTagType('new').subscribe({
      next: (newGames) => {
        this.newGames.set(newGames.slice(0, 20));
      },
      error: (error) => {
        console.error('Failed to load games:', error);
        this.isLoadingGames.set(false);
      }
    })
  }

  private getHotGames():void {
    this.gameService.getGamesByTagType('hot').subscribe({
      next: (hotGames) => {
        this.hotGames.set(hotGames.slice(0, 20));
      },
      error: (error) => {
        console.error('Failed to load games:', error);
        this.isLoadingGames.set(false);
      }
    })
  }

}
