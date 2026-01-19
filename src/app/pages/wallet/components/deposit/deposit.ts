import { Component, inject, signal, computed, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SerachSelect } from '../../../../shared/components/serach-select/serach-select';
import { SearchSelectOption } from '../../../../shared/components/serach-select/models/search-select.model';
import { Payment } from '../../../../core/services/payment/payment.service';
import { Icon } from '../../../../shared/components/icon/icon';
import { TelegramAuthService } from '../../../../core/services/telegram/telegram-auth.service';

@Component({
  selector: 'app-deposit',
  imports: [SerachSelect, ReactiveFormsModule, Icon],
  templateUrl: './deposit.html',
  styleUrl: './deposit.css',
})
export class Deposit {
  private readonly paymentService = inject(Payment);
  private readonly fb = inject(FormBuilder);
  private readonly telegramAuthService = inject(TelegramAuthService);
  protected readonly user = this.telegramAuthService.user;
  
  protected availableCurrencies = this.paymentService.getAvailableCurrencies();
  protected selectedCurrency = signal<SearchSelectOption | null>(this.availableCurrencies[0] || null);
  
  protected userCurrency = computed(() => this.user()?.projectCurrency);
  protected minDepositAmount = 100;
  
  protected depositForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(this.minDepositAmount)]]
  });
  
  get errorMessage(): string {
    const amountControl = this.depositForm.get('amount');
    if (!amountControl?.value || !amountControl?.touched) {
      return '';
    }
    
    const minAmount = this.minDepositAmount;
    const currency = this.userCurrency() || 'FTNF';
    const amountNum = parseFloat(amountControl.value);
    
    if (amountControl.hasError('required')) {
      return 'Amount is required';
    }
    
    if (amountControl.hasError('min') || amountNum < minAmount) {
      return `Minimum deposit amount is ${minAmount} ${currency}`;
    }
    
    return '';
  }
  
  get isButtonDisabled(): boolean {
    return !this.depositForm.valid;
  }
  
  onCurrencySelected(currency: SearchSelectOption) {
    this.selectedCurrency.set(currency);
  }
  
  onAmountInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    
    value = value.replace(/[^0-9]/g, '');
    
    this.depositForm.patchValue({ amount: value }, { emitEvent: false });
    input.value = value;
  }
}
