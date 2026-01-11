import { Component, OnInit, signal } from '@angular/core';
import { PromoCarousel } from '../../shared/components/promo-carousel/promo-carousel';
import { PromoSlide } from '../../shared/components/promo-carousel/models/promo-carousel.model';
import { Categories } from "../../shared/components/categories/categories";
import { GameCard as GameCardComponent } from '../../shared/components/game-card/game-card';
import { GameCard } from '../../shared/components/game-card/models/game-card.model';
import { GameCardService } from '../../shared/components/game-card/services/game-card.service';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-home',
  imports: [PromoCarousel, Categories, GameCardComponent, Icon],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  topGames = signal<GameCard[]>([]);
  newGames = signal<GameCard[]>([]);

  // Drag to scroll state
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private currentSlider: HTMLElement | null = null;

  constructor(private gameCardService: GameCardService) {}
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

  ngOnInit(): void {
    this.loadTopGames();
    this.loadNewGames();
  }

  private loadTopGames(): void {
    this.gameCardService.getHotGames().subscribe(games => {
      this.topGames.set(games);
    });
  }

  private loadNewGames(): void {
    this.gameCardService.getNewGames().subscribe(games => {
      this.newGames.set(games);
    });
  }

  // Drag to scroll handlers
  onMouseDown(event: MouseEvent, slider: HTMLElement): void {
    this.isDragging = true;
    this.currentSlider = slider;
    this.startX = event.pageX;
    this.scrollLeft = slider.scrollLeft;
    slider.classList.add('dragging');
    slider.style.scrollSnapType = 'none';
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.currentSlider) return;
    event.preventDefault();
    const x = event.pageX;
    const distance = (x - this.startX) * 1.5; // Scroll speed multiplier
    this.currentSlider.scrollLeft = this.scrollLeft - distance;
  }

  onMouseUp(): void {
    if (this.currentSlider) {
      this.currentSlider.classList.remove('dragging');
      this.currentSlider.style.scrollSnapType = 'x mandatory';
    }
    this.isDragging = false;
    this.currentSlider = null;
  }
}
