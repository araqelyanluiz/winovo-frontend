import { Component, input, output, signal, computed, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchSelectOption } from './models/search-select.model';
import { Icon } from '../icon/icon';
import { CurrencyConverter } from '../../../core/services/payment/currency-converter.service';

@Component({
  selector: 'app-search-select',
  imports: [CommonModule, FormsModule, Icon],
  templateUrl: './serach-select.html',
  styleUrl: './serach-select.css',
})
export class SerachSelect {
  protected readonly currencyConverter = inject(CurrencyConverter);
  
  options = input.required<SearchSelectOption[]>();
  placeholder = input<string>('Search currency...');
  selectedOption = input<SearchSelectOption | null>(null);
  
  optionSelected = output<SearchSelectOption>();
  
  isOpen = signal<boolean>(false);
  searchQuery = signal<string>('');
  
  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.options();
    
    return this.options().filter(option => 
      option.label.toLowerCase().includes(query)
    );
  });
  
  selectedValue = signal<SearchSelectOption | null>(null);
  
  protected userCurrency = computed(() => {
    return this.currencyConverter['baseCurrency']?.() || 'USD';
  });
  
  protected conversionRates = computed(() => {
    const baseCurr = this.currencyConverter['baseCurrency']?.() || 'USD';
    const rates = new Map<string, number>();
    
    this.options().forEach(option => {
      if (!option.value) return;
      const rateToUserCurrency = this.currencyConverter.convert(1, baseCurr, option.value);
      rates.set(option.value, rateToUserCurrency === 0 ? 0 : 1 / rateToUserCurrency);
    });
    
    return rates;
  });
  
  ngOnInit() {
    if (this.selectedOption()) {
      this.selectedValue.set(this.selectedOption());
    } else if (this.options().length > 0) {
      const firstOption = this.options()[0];
      this.selectedValue.set(firstOption);
      this.optionSelected.emit(firstOption);
    }
  }
  
  toggleDropdown() {
    this.isOpen.update(value => !value);
    if (!this.isOpen()) {
      this.searchQuery.set('');
    }
  }
  
  selectOption(option: SearchSelectOption) {
    this.selectedValue.set(option);
    this.optionSelected.emit(option);
    this.isOpen.set(false);
    this.searchQuery.set('');
  }
  
  getConversionRate(cryptoCurrency: string): number {
    return this.conversionRates().get(cryptoCurrency) ?? 0;
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('app-search-select');
    
    if (!clickedInside && this.isOpen()) {
      this.isOpen.set(false);
      this.searchQuery.set('');
    }
  }
}
