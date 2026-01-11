import { Component, OnInit, signal, computed } from '@angular/core';
import { GameCard as GameCardComponent } from '../../shared/components/game-card/game-card';
import { GameCard } from '../../shared/components/game-card/models/game-card.model';
import { GameCardService } from '../../shared/components/game-card/services/game-card.service';

interface Category {
  id: string;
  name: string;
}

interface Provider {
  id: string;
  name: string;
}

@Component({
  selector: 'app-casino',
  imports: [GameCardComponent],
  templateUrl: './casino.html',
  styleUrl: './casino.css',
})
export class Casino implements OnInit {
  allGames = signal<GameCard[]>([]);
  selectedCategory = signal<string>('all');
  selectedProvider = signal<string>('all');

  // Drag to scroll state
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private currentSlider: HTMLElement | null = null;
  private hasMoved = false;

  categories: Category[] = [
    { id: 'all', name: 'All' },
    { id: 'slots', name: 'Slots' },
    { id: 'live-casino', name: 'Live Casino' },
    { id: 'roulette', name: 'Roulette' },
    { id: 'blackjack', name: 'Blackjack' },
    { id: 'crash-games', name: 'Crash Games' }
  ];

  providers: Provider[] = [
    { id: 'all', name: 'All Providers' },
    { id: 'Pragmatic Play', name: 'Pragmatic Play' },
    { id: 'Evolution', name: 'Evolution Gaming' },
    { id: 'NetEnt', name: 'NetEnt' },
    { id: 'Play\'n GO', name: 'Play\'n GO' },
    { id: 'Spribe', name: 'Spribe' },
    { id: 'Hacksaw Gaming', name: 'Hacksaw Gaming' }
  ];

  filteredGames = computed(() => {
    let games = this.allGames();
    
    // Filter by category
    if (this.selectedCategory() !== 'all') {
      games = games.filter(game => game.category === this.selectedCategory());
    }
    
    // Filter by provider
    if (this.selectedProvider() !== 'all') {
      games = games.filter(game => game.provider === this.selectedProvider());
    }
    
    return games;
  });

  constructor(private gameCardService: GameCardService) {}

  ngOnInit(): void {
    this.loadGames();
  }

  private loadGames(): void {
    this.gameCardService.getGames().subscribe(games => {
      this.allGames.set(games);
    });
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }

  selectProvider(providerId: string): void {
    this.selectedProvider.set(providerId);
  }

  getCategoryClass(categoryId: string): string {
    const isActive = this.selectedCategory() === categoryId;
    return isActive 
      ? 'bg-primary text-black' 
      : 'bg-white/5 text-white hover:bg-white/10';
  }

  getProviderClass(providerId: string): string {
    const isActive = this.selectedProvider() === providerId;
    return isActive 
      ? 'border-primary bg-primary/10 text-primary' 
      : 'border-white/10 text-white hover:border-white/20 hover:bg-white/5';
  }

  resetFilters(): void {
    this.selectedCategory.set('all');
    this.selectedProvider.set('all');
  }

  // Drag to scroll handlers
  onMouseDown(event: MouseEvent, slider: HTMLElement): void {
    this.isDragging = true;
    this.hasMoved = false;
    this.currentSlider = slider;
    this.startX = event.pageX;
    this.scrollLeft = slider.scrollLeft;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.currentSlider) return;
    
    const x = event.pageX;
    const distance = Math.abs(x - this.startX);
    
    // Only start dragging if moved more than 5px
    if (distance > 5) {
      this.hasMoved = true;
      event.preventDefault();
      this.currentSlider.classList.add('dragging');
      this.currentSlider.style.scrollSnapType = 'none';
      const walk = (x - this.startX) * 1.5;
      this.currentSlider.scrollLeft = this.scrollLeft - walk;
    }
  }

  onMouseUp(): void {
    if (this.currentSlider) {
      this.currentSlider.classList.remove('dragging');
      this.currentSlider.style.scrollSnapType = '';
    }
    this.isDragging = false;
    this.hasMoved = false;
    this.currentSlider = null;
  }
}
