import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SearchSelectOption } from '../../../shared/components/serach-select/models/search-select.model';
import { AVAILABLE_CURRENCIES } from './models/available-currencies.const';
import { TransactionHistoryResponse } from './models/transaction-history.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Payment {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  
  getAvailableCurrencies(): SearchSelectOption[] {
    return AVAILABLE_CURRENCIES;
  }
  
  getTransactionHistory(telegramId: number, page: number = 1, limit: number = 10): Observable<TransactionHistoryResponse> {
    return this.http.get<TransactionHistoryResponse>(`${this.apiUrl}/transactions/user/${telegramId}?page=${page}&limit=${limit}`);
  }
  
  createDeposit(data: {
    amount: number;
    crypto_currency: string;
    crypto_amount: string;
    telegram_id: number;
    username: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/deposit/fulgurpay`, data);
  }
  
  createWithdraw(data: {
    telegram_id: number;
    username: string;
    amount: number;
    crypto_amount: number;
    crypto_currency: string;
    address: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/withdraw/fulgurpay`, data);
  }
}
