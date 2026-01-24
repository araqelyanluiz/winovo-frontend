import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromoCarousel } from './promo-carousel';
import { PromoSlide } from './models/promo-carousel.model';

describe('PromoCarousel', () => {
  let component: PromoCarousel;
  let fixture: ComponentFixture<PromoCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoCarousel]
    }).compileComponents();

    fixture = TestBed.createComponent(PromoCarousel);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty state when no slides', () => {
    component.slides = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('No promo slides available');
  });

  it('should display slides when provided', () => {
    const mockSlides: PromoSlide[] = [
      {
        backgroundImage: 'url(/assets/images/test-slide.jpg)',
      }
    ];
    component.slides = mockSlides;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Title');
  });

  it('should navigate to next slide', () => {
    const mockSlides: PromoSlide[] = [
      { backgroundImage: 'url(/assets/images/test-slide1.jpg)' },
      { backgroundImage: 'url(/assets/images/test-slide2.jpg)' }
    ];
    component.slides = mockSlides;
    component.currentIndex.set(0);
    component.next();
    expect(component.currentIndex()).toBe(1);
  });

  it('should navigate to previous slide', () => {
    const mockSlides: PromoSlide[] = [
      { backgroundImage: 'url(/assets/images/test-slide1.jpg)' },
      { backgroundImage: 'url(/assets/images/test-slide2.jpg)' }
    ];
    component.slides = mockSlides;
    component.currentIndex.set(1);
    component.prev();
    expect(component.currentIndex()).toBe(0);
  });

  it('should loop when enabled', () => {
    const mockSlides: PromoSlide[] = [
      { backgroundImage: 'url(/assets/images/test-slide1.jpg)' },
      { backgroundImage: 'url(/assets/images/test-slide2.jpg)' }
    ];
    component.slides = mockSlides;
    component.loop = true;
    component.currentIndex.set(1);
    component.next();
    expect(component.currentIndex()).toBe(0);
  });

  it('should hide navigation when only one slide', () => {
    const mockSlides: PromoSlide[] = [
      { backgroundImage: 'url(/assets/images/test-slide1.jpg)' }
    ];
    component.slides = mockSlides;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('button[aria-label*="slide"]');
    expect(buttons.length).toBe(0);
  });
});
