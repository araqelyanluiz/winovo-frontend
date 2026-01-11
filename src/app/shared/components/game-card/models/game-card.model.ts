export interface GameCard {
  id: string;
  name: string;
  provider: string;
  thumbnail: string;
  category?: string;
  isNew?: boolean;
  isHot?: boolean;
  isFavorite?: boolean;
  url?: string;
  rtp?: string;
  volatility?: 'Low' | 'Medium' | 'High' | 'Very High';
}
