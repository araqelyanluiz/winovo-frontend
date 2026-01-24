import { Component, inject, signal, computed, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SerachSelect } from '../../../../shared/components/serach-select/serach-select';
import { SearchSelectOption } from '../../../../shared/components/serach-select/models/search-select.model';
import { Payment } from '../../../../core/services/payment/payment.service';
import { CurrencyConverter } from '../../../../core/services/payment/currency-converter.service';
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
  private readonly currencyConverter = inject(CurrencyConverter);
  protected readonly user = this.telegramAuthService.user;
  
  protected availableCurrencies = this.paymentService.getAvailableCurrencies();
  protected selectedCurrency = signal<SearchSelectOption | null>(this.availableCurrencies[0] || null);
  
  protected userCurrency = computed(() => this.user()?.projectCurrency);
  protected minDepositAmount = 100;
  
  protected depositForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(this.minDepositAmount)]]
  });
  
  protected amountValue = signal<string>('');
  protected showSuccess = signal<boolean>(false);
  protected showError = signal<boolean>(false);
  protected depositAddress = signal<string | null>(null);
  protected isLoading = signal<boolean>(false);
  protected showCopiedTooltip = signal<boolean>(false);
  
  protected convertedAmount = computed(() => {
    const amountStr = this.amountValue();
    const amount = parseFloat(amountStr || '0');
    const fromCurrency = this.userCurrency();
    const toCurrency = this.selectedCurrency()?.value;
    
    if (!amountStr || amount === 0 || !fromCurrency || !toCurrency) {
      return null;
    }
    
    const converted = this.currencyConverter.convert(amount, fromCurrency, toCurrency);
    return {
      amount,
      fromCurrency,
      toCurrency,
      convertedValue: converted
    };
  });
  
  protected formErrorMessage = computed(() => {
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
  });
  
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
    this.amountValue.set(value);
    input.value = value;
  }
  
  onGenerateAddress() {
    if (this.depositForm.invalid) {
      return;
    }
    
    const user = this.user();
    const converted = this.convertedAmount();
    
    if (!user || !converted) {
      return;
    }
    
    const depositData = {
      amount: converted.amount,
      crypto_currency: converted.toCurrency,
      crypto_amount: String(converted.convertedValue),
      telegram_id: user.telegram_id,
      username: user.username || ''
    };
    
    this.isLoading.set(true);
    
    this.paymentService.createDeposit(depositData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.data?.status === 'success' && response.data?.data) {
          this.depositAddress.set(response.data.data.address || null);
          this.showSuccess.set(true);
          this.showError.set(false);
        } else {
          this.depositAddress.set(null);
          this.showError.set(true);
          this.showSuccess.set(false);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.depositAddress.set(null);
        this.showError.set(true);
        this.showSuccess.set(false);
      }
    });
  }
  
  onCopyAddress() {
    const address = this.depositAddress();
    if (address && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(address);
      this.showCopiedTooltip.set(true);
      setTimeout(() => this.showCopiedTooltip.set(false), 2000);
    }
  }
  
  onTryAgain() {
    this.showError.set(false);
    this.depositAddress.set(null);
  }
  
  onGenerateNewAddress() {
    this.showSuccess.set(false);
    this.depositAddress.set(null);
    this.depositForm.reset();
    this.amountValue.set('');
  }
}
