import { Component, input, output, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchSelectOption } from './models/search-select.model';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-search-select',
  imports: [CommonModule, FormsModule,Icon],
  templateUrl: './serach-select.html',
  styleUrl: './serach-select.css',
})
export class SerachSelect {
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
