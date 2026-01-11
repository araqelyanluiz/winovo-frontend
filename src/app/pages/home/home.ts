import { Component } from '@angular/core';
import { PromoCarousel } from '../../shared/components/promo-carousel/promo-carousel';
import { PromoSlide } from '../../shared/components/promo-carousel/models/promo-carousel.model';
import { Categories } from "../../shared/components/categories/categories";

@Component({
  selector: 'app-home',
  imports: [PromoCarousel, Categories],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
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
}
