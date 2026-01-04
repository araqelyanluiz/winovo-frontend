export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  success: string;
  warning: string;
  danger: string;
}

export interface Features {
  enableAuth: boolean;
  enablePayments: boolean;
  enablePromotions: boolean;
}

export interface SEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface Config {
  projectName: string;
  theme: Theme;
  features: Features;
  seo: SEO;
}
