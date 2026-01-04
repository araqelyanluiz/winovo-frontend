export interface Theme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
}

export interface Features {
  [key: string]: boolean;
}

export interface SEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface AppConfig {
  projectName: string;
  theme: Theme;
  features: Features;
  seo: SEO;
}
