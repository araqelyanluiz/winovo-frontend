import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GameCard } from '../models/game-card.model';

@Injectable({
  providedIn: 'root'
})
export class GameCardService {
  
  // Mock data - в будущем заменить на реальный API
  private mockGames: GameCard[] = [
    {
      id: '1',
      name: 'Sweet Bonanza',
      provider: 'Pragmatic Play',
      thumbnail: '/assets/images/games/sweet-bonanza.jpg',
      category: 'slots',
      isHot: true,
      isNew: false,
      isFavorite: false,
      url: '/game/sweet-bonanza',
      rtp: '96.51% RTP',
      volatility: 'High'
    },
    {
      id: '2',
      name: 'Gates of Olympus',
      provider: 'Pragmatic Play',
      thumbnail: '/assets/images/games/gates-of-olympus.jpg',
      category: 'slots',
      isHot: true,
      isNew: false,
      isFavorite: false,
      url: '/game/gates-of-olympus',
      rtp: '96.50% RTP',
      volatility: 'Very High'
    },
    {
      id: '3',
      name: 'Sugar Rush',
      provider: 'Pragmatic Play',
      thumbnail: '/assets/images/games/sugar-rush.jpg',
      category: 'slots',
      isHot: false,
      isNew: true,
      isFavorite: false,
      url: '/game/sugar-rush',
      rtp: '96.50% RTP',
      volatility: 'High'
    },
    {
      id: '4',
      name: 'Book of Dead',
      provider: 'Play\'n GO',
      thumbnail: '/assets/images/games/book-of-dead.jpg',
      category: 'slots',
      isHot: false,
      isNew: false,
      isFavorite: true,
      url: '/game/book-of-dead',
      rtp: '96.21% RTP',
      volatility: 'High'
    },
    {
      id: '5',
      name: 'Crazy Time',
      provider: 'Evolution',
      thumbnail: '/assets/images/games/crazy-time.jpg',
      category: 'live-casino',
      isHot: true,
      isNew: false,
      isFavorite: false,
      url: '/game/crazy-time',
      rtp: '96.08% RTP',
      volatility: 'Medium'
    },
    {
      id: '6',
      name: 'Monopoly Live',
      provider: 'Evolution',
      thumbnail: '/assets/images/games/monopoly-live.jpg',
      category: 'live-casino',
      isHot: false,
      isNew: false,
      isFavorite: false,
      url: '/game/monopoly-live',
      rtp: '96.23% RTP',
      volatility: 'Low'
    },
    {
      id: '7',
      name: 'Lightning Roulette',
      provider: 'Evolution',
      thumbnail: '/assets/images/games/lightning-roulette.jpg',
      category: 'roulette',
      isHot: true,
      isNew: false,
      isFavorite: true,
      url: '/game/lightning-roulette',
      rtp: '97.30% RTP',
      volatility: 'Medium'
    },
    {
      id: '8',
      name: 'Aviator',
      provider: 'Spribe',
      thumbnail: '/assets/images/games/aviator.jpg',
      category: 'crash-games',
      isHot: true,
      isNew: false,
      isFavorite: false,
      url: '/game/aviator',
      rtp: '97.00% RTP',
      volatility: 'Medium'
    },
    {
      id: '9',
      name: 'JetX',
      provider: 'SmartSoft Gaming',
      thumbnail: '/assets/images/games/jetx.jpg',
      category: 'crash-games',
      isHot: false,
      isNew: true,
      isFavorite: false,
      url: '/game/jetx',
      rtp: '97.00% RTP',
      volatility: 'High'
    },
    {
      id: '10',
      name: 'Blackjack Classic',
      provider: 'Evolution',
      thumbnail: '/assets/images/games/blackjack-classic.jpg',
      category: 'blackjack',
      isHot: false,
      isNew: false,
      isFavorite: false,
      url: '/game/blackjack-classic',
      rtp: '99.50% RTP',
      volatility: 'Low'
    },
    {
      id: '11',
      name: 'Starburst',
      provider: 'NetEnt',
      thumbnail: '/assets/images/games/starburst.jpg',
      category: 'slots',
      isHot: false,
      isNew: false,
      isFavorite: true,
      url: '/game/starburst',
      rtp: '96.09% RTP',
      volatility: 'Low'
    },
    {
      id: '12',
      name: 'Wanted Dead or a Wild',
      provider: 'Hacksaw Gaming',
      thumbnail: '/assets/images/games/wanted-dead.jpg',
      category: 'slots',
      isHot: false,
      isNew: true,
      isFavorite: false,
      url: '/game/wanted-dead',
      rtp: '96.38% RTP',
      volatility: 'Very High'
    }
  ];

  getGames(): Observable<GameCard[]> {
    return of(this.mockGames);
  }

  getGameById(id: string): Observable<GameCard | undefined> {
    const game = this.mockGames.find(g => g.id === id);
    return of(game);
  }

  getGamesByCategory(category: string): Observable<GameCard[]> {
    const games = this.mockGames.filter(g => g.category === category);
    return of(games);
  }

  getHotGames(): Observable<GameCard[]> {
    const games = this.mockGames.filter(g => g.isHot);
    return of(games);
  }

  getNewGames(): Observable<GameCard[]> {
    const games = this.mockGames.filter(g => g.isNew);
    return of(games);
  }

  getFavoriteGames(): Observable<GameCard[]> {
    const games = this.mockGames.filter(g => g.isFavorite);
    return of(games);
  }

  toggleFavorite(gameId: string): Observable<boolean> {
    const game = this.mockGames.find(g => g.id === gameId);
    if (game) {
      game.isFavorite = !game.isFavorite;
      return of(true);
    }
    return of(false);
  }
}
