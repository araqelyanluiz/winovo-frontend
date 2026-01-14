import {
  Component,
  Input,
  signal,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  inject,
  afterNextRender,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PromoSlide } from './models/promo-carousel.model';

@Component({
  selector: 'app-promo-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promo-carousel.html',
  styleUrl: './promo-carousel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoCarousel {
  @Input() slides: PromoSlide[] = [];
  @Input() autoplay = true;
  @Input() autoplayMs = 4500;
  @Input() peekPx = 28;
  @Input() height = 180;
  @Input() loop = true;

  @ViewChild('track', { read: ElementRef }) trackRef?: ElementRef<HTMLElement>;

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  currentIndex = signal(0);
  isHovered = signal(false);
  isDragging = signal(false);

  private dragStartX = 0;
  private scrollStartLeft = 0;
  private dragThreshold = 40;

  private autoplayTimer?: ReturnType<typeof setInterval>;

  constructor() {
    if (this.isBrowser) {
      afterNextRender(() => {
        this.initBrowserFeatures();
      });
    }
  }

  private initBrowserFeatures(): void {
    this.setupKeyboardNavigation();

    if (this.autoplay) {
      this.startAutoplay();
    }

    this.scrollToCurrentSlide(false);
  }

  private setupKeyboardNavigation(): void {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      }
    };

    window.addEventListener('keydown', handleKeydown);
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      if (!this.isHovered() && !this.isDragging()) {
        this.next();
      }
    }, this.autoplayMs);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  private resetAutoplay(): void {
    if (this.autoplay && this.isBrowser) {
      this.startAutoplay();
    }
  }

  // Navigation methods
  prev(): void {
    const newIndex = this.currentIndex() > 0
      ? this.currentIndex() - 1
      : this.loop ? this.slides.length - 1 : 0;
    this.goToSlide(newIndex);
  }

  next(): void {
    const newIndex = this.currentIndex() < this.slides.length - 1
      ? this.currentIndex() + 1
      : this.loop ? 0 : this.slides.length - 1;
    this.goToSlide(newIndex);
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.slides.length) return;
    this.currentIndex.set(index);
    this.scrollToCurrentSlide(true);
    this.resetAutoplay();
  }

  onSlideClick(index: number): void {
    if (index !== this.currentIndex()) {
      this.goToSlide(index);
    }
  }

  private scrollToCurrentSlide(smooth: boolean): void {
    if (!this.isBrowser || !this.trackRef) return;

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const track = this.trackRef?.nativeElement;
      if (!track) return;

      const slides = Array.from(track.children) as HTMLElement[];
      const targetSlide = slides[this.currentIndex()];
      if (!targetSlide) return;

      const scrollLeft = targetSlide.offsetLeft - this.peekPx;

      track.scrollTo({
        left: scrollLeft,
        behavior: smooth ? 'smooth' : 'auto',
      });
    });
  }

  // Drag handlers
  onPointerDown(e: PointerEvent): void {
    if (!this.isBrowser) return;

    this.isDragging.set(true);
    this.dragStartX = e.clientX;
    this.scrollStartLeft = this.trackRef?.nativeElement.scrollLeft || 0;

    // Capture pointer
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.isDragging() || !this.isBrowser || !this.trackRef) return;

    const track = this.trackRef.nativeElement;
    const deltaX = e.clientX - this.dragStartX;

    // Update scroll position
    track.scrollLeft = this.scrollStartLeft - deltaX;
  }

  onPointerUp(e: PointerEvent): void {
    if (!this.isDragging() || !this.isBrowser) return;

    const deltaX = e.clientX - this.dragStartX;

    // Determine if we should change slides
    if (Math.abs(deltaX) > this.dragThreshold) {
      if (deltaX < 0) {
        // Swiped left -> next
        this.next();
      } else {
        // Swiped right -> prev
        this.prev();
      }
    } else {
      // Snap back to current slide
      this.scrollToCurrentSlide(true);
    }

    this.isDragging.set(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }

  onPointerCancel(): void {
    if (!this.isBrowser) return;
    this.isDragging.set(false);
    this.scrollToCurrentSlide(true);
  }

  // Mouse hover handlers
  onMouseEnter(): void {
    if (!this.isBrowser) return;
    this.isHovered.set(true);
  }

  onMouseLeave(): void {
    if (!this.isBrowser) return;
    this.isHovered.set(false);
  }

  // Style helpers
  getCardClasses(theme?: string): string {
    return 'shadow-2xl';
  }

  getGradientClasses(theme?: string): string {
    switch (theme) {
      case 'vip':
        return 'bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-800';
      case 'welcome':
        return 'bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-900';
      case 'crypto':
        return 'bg-gradient-to-r from-orange-900 via-amber-900 to-yellow-900';
      default:
        return 'bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-800';
    }
  }

  getGlowClasses(theme?: string): string {
    switch (theme) {
      case 'vip':
        return 'bg-purple-500';
      case 'welcome':
        return 'bg-pink-500';
      case 'crypto':
        return 'bg-orange-500';
      default:
        return 'bg-purple-500';
    }
  }

  getBadgeClasses(theme?: string): string {
    switch (theme) {
      case 'welcome':
        return 'bg-pink-400 text-black';
      case 'crypto':
        return 'bg-orange-400 text-black';
      default:
        return 'bg-yellow-400 text-black';
    }
  }

  getCtaClasses(theme?: string): string {
    switch (theme) {
      case 'welcome':
        return 'bg-pink-500 hover:bg-pink-600 text-white';
      case 'crypto':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      default:
        return 'bg-yellow-400 hover:bg-yellow-500 text-black';
    }
  }
}
