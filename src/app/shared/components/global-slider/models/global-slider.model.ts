export interface SliderItem {
  id: string | number;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

export interface SliderConfig {
  autoplay?: boolean;
  autoplayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  slidesPerView?: number;
  spaceBetween?: number;
}
