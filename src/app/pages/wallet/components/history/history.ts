import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Payment } from '../../../../core/services/payment/payment.service';
import { TelegramAuthService } from '../../../../core/services/telegram/telegram-auth.service';
import { Transaction } from '../../../../core/services/payment/models/transaction-history.model';
import { Icon } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-history',
  imports: [CommonModule, Icon],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {
  private readonly paymentService = inject(Payment);
  private readonly telegramAuthService = inject(TelegramAuthService);
  protected readonly user = this.telegramAuthService.user;
  
  protected transactions = signal<Transaction[]>([]);
  protected isLoading = signal<boolean>(true);
  protected page = signal<number>(1);
  protected limit = 10;
  protected totalPages = signal<number>(1);
  protected total = signal<number>(0);
  
  ngOnInit() {
    this.loadTransactions();
  }
  
  loadTransactions() {
    const telegramId = this.user()?.telegram_id;
    if (!telegramId) return;
    
    this.isLoading.set(true);
    this.paymentService.getTransactionHistory(telegramId, this.page(), this.limit)
      .subscribe({
        next: (response) => {
          this.transactions.set(response.data);
          this.totalPages.set(response.pagination.total_pages);
          this.total.set(response.pagination.total);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
          this.isLoading.set(false);
        }
      });
  }
  
  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
      this.loadTransactions();
    }
  }
  
  prevPage() {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      this.loadTransactions();
    }
  }
  
  goToPage(pageNum: number) {
    if (pageNum >= 1 && pageNum <= this.totalPages()) {
      this.page.set(pageNum);
      this.loadTransactions();
    }
  }
  
  getTransactionType(transaction: Transaction): string {
    return transaction.type.toLowerCase();
  }
  
  getTransactionAmount(transaction: Transaction): string {
    const amount = transaction.type.toLowerCase() === 'deposit' || transaction.type.toLowerCase() === 'withdraw' 
      ? transaction.crypto_amount 
      : transaction.amount;
    
    if (!amount || amount === null || amount === undefined) {
      return '0.00';
    }
    
    return parseFloat(amount).toFixed(2);
  }
  
  getTransactionCurrency(transaction: Transaction): string {
    return transaction.type.toLowerCase() === 'deposit' || transaction.type.toLowerCase() === 'withdraw'
      ? transaction.crypto_currency
      : transaction.currency;
  }
  
  getTransactionTitle(transaction: Transaction): string {
    const type = transaction.type;
    const opType = transaction.op_type || '';
    
    if (type.toLowerCase() === 'deposit') return 'Deposit';
    if (type.toLowerCase() === 'withdraw') return 'Withdraw';
    if (opType) return `${type} - ${opType}`;
    return type;
  }
  
  getTransactionIcon(transaction: Transaction): string {
    const type = transaction.type.toLowerCase();
    switch(type) {
      case 'deposit': return 'deposit-arrow';
      case 'withdraw': return 'withdraw-arrow';
      case 'win': return 'wallet-base';
      case 'bet': return 'wallet-base';
      default: return 'wallet-base';
    }
  }
  
  getTransactionColor(transaction: Transaction): string {
    const type = transaction.type.toLowerCase();
    switch(type) {
      case 'deposit': return 'text-success';
      case 'withdraw': return 'text-warning';
      case 'win': return 'text-success';
      case 'bet': return 'text-foreground';
      default: return 'text-foreground';
    }
  }
  
  getStatusColor(status: string): string {
    switch(status) {
      case 'success': return 'bg-success/20 text-success';
      case 'pending': return 'bg-warning/20 text-warning';
      case 'failed': return 'bg-destructive/20 text-destructive';
      default: return 'bg-primary/20 text-white';
    }
  }
}
