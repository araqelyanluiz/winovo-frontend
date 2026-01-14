import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GameCategory } from '../models/categories.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  
  private mockCategories: GameCategory[] = [
    {
      id: 'slots',
      name: 'Slots',
      icon: 'slots',
      url: '/casino/slots',
      gamesCount: 120,
    },
    {
      id: 'live-casino',
      name: 'Live Casino',
      icon: 'live-casino',
      url: '/casino/live',
      gamesCount: 85,
    },
    {
      id: 'roulette',
      name: 'Roulette',
      icon: 'roulette',
      url: '/casino/roulette',
      gamesCount: 80,
    },
    {
      id: 'blackjack',
      name: 'Blackjack',
      icon: 'black-jack',
      url: '/casino/blackjack',
      gamesCount: 45,
    },
    {
      id: 'crash-games',
      name: 'Crash Games',
      icon: 'crash',
      url: '/casino/crash',
      gamesCount: 25,
    }
  ];

  getCategories(): Observable<GameCategory[]> {
    return of(this.mockCategories);
  }

  getCategoryById(id: string): Observable<GameCategory | undefined> {
    return of(this.mockCategories.find(cat => cat.id === id));
  }
}
