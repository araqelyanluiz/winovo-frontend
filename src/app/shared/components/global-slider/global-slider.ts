import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  signal,
  ElementRef,
  viewChild,
} from '@angular/core';
import { Game } from '../../../core/services/game/game.model';
import { GameCard } from '../game-card/game-card';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-global-slider',
  standalone: true,
  imports: [GameCard, Loader],
  templateUrl: './global-slider.html',
  styleUrl: './global-slider.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSlider {
  items = input<Game[]>([]);
  isLoading = input<boolean>(false);
  
  itemClick = output<Game>();

  private isDragging = signal(false);
  private startX = 0;
  private scrollLeft = 0;
  private containerRef?: HTMLElement;
  private lastX = 0;
  private velocity = 0;
  private animationFrame?: number;

  trackBySlideId(index: number, item: Game): string {
    return item.id;
  }

  onPointerDown(event: PointerEvent): void {
    const container = event.currentTarget as HTMLElement;
    this.containerRef = container;
    this.isDragging.set(true);
    this.startX = event.pageX - container.offsetLeft;
    this.lastX = event.pageX;
    this.scrollLeft = container.scrollLeft;
    this.velocity = 0;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging() || !this.containerRef) return;
    
    event.preventDefault();
    const x = event.pageX - this.containerRef.offsetLeft;
    const walk = x - this.startX;
    this.containerRef.scrollLeft = this.scrollLeft - walk;
    
    this.velocity = event.pageX - this.lastX;
    this.lastX = event.pageX;
  }

  onPointerUp(event: PointerEvent): void {
    this.isDragging.set(false);
    
    if (this.containerRef && Math.abs(this.velocity) > 1) {
      this.applyMomentum();
    }
  }

  onPointerCancel(): void {
    this.isDragging.set(false);
  }

  onTouchStart(event: TouchEvent): void {
    const container = event.currentTarget as HTMLElement;
    this.containerRef = container;
    this.startX = event.touches[0].pageX - container.offsetLeft;
    this.lastX = event.touches[0].pageX;
    this.scrollLeft = container.scrollLeft;
    this.velocity = 0;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.containerRef) return;
    
    const x = event.touches[0].pageX - this.containerRef.offsetLeft;
    const walk = x - this.startX;
    this.containerRef.scrollLeft = this.scrollLeft - walk;
    
    this.velocity = event.touches[0].pageX - this.lastX;
    this.lastX = event.touches[0].pageX;
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.containerRef && Math.abs(this.velocity) > 1) {
      this.applyMomentum();
    }
    this.containerRef = undefined;
  }

  private applyMomentum(): void {
    if (!this.containerRef) return;
    
    const friction = 0.95;
    const step = () => {
      if (!this.containerRef || Math.abs(this.velocity) < 0.5) {
        this.animationFrame = undefined;
        return;
      }
      
      this.containerRef.scrollLeft -= this.velocity;
      this.velocity *= friction;
      
      this.animationFrame = requestAnimationFrame(step);
    };
    
    this.animationFrame = requestAnimationFrame(step);
  }
}
