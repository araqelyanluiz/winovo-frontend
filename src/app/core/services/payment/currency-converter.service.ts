import { Injectable, inject, signal, effect, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, switchMap, catchError, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TelegramAuthService } from '../telegram/telegram-auth.service';

interface CoinbaseRates {
  data: {
    currency: string;
    rates: {
      [key: string]: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverter {
  private readonly http = inject(HttpClient);
  private readonly telegramAuthService = inject(TelegramAuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly coinbaseApiUrl = 'https://api.coinbase.com/v2';
  
  private exchangeRates = signal<Map<string, number>>(new Map());
  private lastUpdate = signal<number>(0);
  private baseCurrency = signal<string>('USD');
  
  constructor() {
    effect(() => {
      const userCurrency = this.telegramAuthService.user()?.projectCurrency;
      if (userCurrency) {
        this.baseCurrency.set(userCurrency.toUpperCase());
        this.fetchExchangeRates().subscribe();
      }
    });
    
    this.startRealTimeUpdates();
  }
  
  private startRealTimeUpdates() {
    interval(60000)
      .pipe(
        switchMap(() => this.fetchExchangeRates()),
        catchError(error => {
          console.error('Failed to fetch exchange rates:', error);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
    
    this.fetchExchangeRates().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
  
  private fetchExchangeRates() {
    const currency = this.baseCurrency();
    
    return this.http.get<CoinbaseRates>(`${this.coinbaseApiUrl}/exchange-rates?currency=${currency}`).pipe(
      tap(response => {
        const ratesMap = new Map<string, number>();
        
        Object.entries(response.data.rates).forEach(([currencyCode, rate]) => {
          const numericRate = parseFloat(rate);
          if (!isNaN(numericRate)) {
            ratesMap.set(currencyCode, numericRate);
          }
        });
        
        this.exchangeRates.set(ratesMap);
        this.lastUpdate.set(Date.now());
      })
    );
  }
  
  convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }
    
    const rates = this.exchangeRates();
    
    if (rates.size === 0) {
      console.warn('Exchange rates not loaded yet');
      return 0;
    }
    
    const toRate = rates.get(toCurrency);
    
    if (!toRate) {
      console.warn(`Missing exchange rate for ${toCurrency}`);
      return 0;
    }
    
    return Math.round(amount * toRate * 100000000) / 100000000;
  }
  
  getRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) {
      return 1;
    }
    
    const rates = this.exchangeRates();
    const fromRate = rates.get(fromCurrency) || 1;
    const toRate = rates.get(toCurrency) || 1;
    
    return toRate / fromRate;
  }
  
  getLastUpdateTime(): number {
    return this.lastUpdate();
  }
}
