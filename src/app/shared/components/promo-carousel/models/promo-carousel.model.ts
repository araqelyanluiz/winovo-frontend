export interface PromoSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  theme?: 'vip' | 'welcome' | 'crypto';
  accentColor?: string;
  icon?: 'crown' | 'btc' | 'gift';
}
