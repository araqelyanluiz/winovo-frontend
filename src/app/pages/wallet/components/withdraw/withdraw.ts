import { Component, signal, computed, inject, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Icon } from '../../../../shared/components/icon/icon';
import { TelegramAuthService } from '../../../../core/services/telegram/telegram-auth.service';
import { SerachSelect } from '../../../../shared/components/serach-select/serach-select';
import { SearchSelectOption } from '../../../../shared/components/serach-select/models/search-select.model';
import { Payment } from '../../../../core/services/payment/payment.service';

@Component({
  selector: 'app-withdraw',
  imports: [ReactiveFormsModule, Icon, SerachSelect],
  templateUrl: './withdraw.html',
  styleUrl: './withdraw.css',
})
export class Withdraw {
  private readonly telegramAuthService = inject(TelegramAuthService);
  private readonly paymentService = inject(Payment);
  private readonly fb = inject(FormBuilder);
  protected readonly user = this.telegramAuthService.user;
  
  protected availableCurrencies = this.paymentService.getAvailableCurrencies();
  protected selectedCurrency = signal<SearchSelectOption | null>(this.availableCurrencies[0] || null);
  
  protected currency = computed(() => this.selectedCurrency()?.value || 'FTNF');
  protected minWithdrawAmount = computed(() => this.selectedCurrency()?.minWithdrawAmount ?? 10);
  protected maxWithdrawAmount = computed(() => {
    const currencyMax = this.selectedCurrency()?.maxWithdrawAmount ?? 0;
    const userBalance = this.user()?.balance ?? 0;
    return Math.min(currencyMax, userBalance);
  });
  
  protected withdrawForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(0)]],
    walletAddress: ['', [Validators.required]]
  });
  
  constructor() {
    effect(() => {
      const currency = this.selectedCurrency();
      const minAmount = currency?.minWithdrawAmount ?? 10;
      const maxAmount = this.maxWithdrawAmount();
      
      this.withdrawForm.get('amount')?.setValidators([
        Validators.required,
        Validators.min(minAmount),
        Validators.max(maxAmount)
      ]);
      this.withdrawForm.get('amount')?.updateValueAndValidity();
    });
  }
  
  protected errorMessage = computed(() => {
    const amountControl = this.withdrawForm.get('amount');
    if (!amountControl?.value || !amountControl?.touched) {
      return '';
    }
    
    const amountNum = parseFloat(amountControl.value);
    const minAmount = this.minWithdrawAmount();
    const maxAmount = this.maxWithdrawAmount();
    
    if (isNaN(amountNum)) {
      return '';
    }
    
    if (amountControl.hasError('required')) {
      return 'Amount is required';
    }
    
    if (amountControl.hasError('min') || amountNum < minAmount) {
      return `Minimum withdraw amount is ${minAmount} ${this.currency()}`;
    }
    
    if (amountControl.hasError('max') || amountNum > maxAmount) {
      return `Maximum withdraw amount is ${maxAmount} ${this.currency()}`;
    }
    
    return '';
  });
  
  onCurrencySelected(currency: SearchSelectOption) {
    this.selectedCurrency.set(currency);
  }
  
  protected isButtonDisabled = computed(() => {
    return !this.withdrawForm.valid;
  });
  
  onAmountInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    
    value = value.replace(/[^0-9.]/g, '');
    
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    this.withdrawForm.patchValue({ amount: value }, { emitEvent: false });
    input.value = value;
  }
}
