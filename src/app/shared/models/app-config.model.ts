import { NavigationItem } from "../../layout/navigation/navigation.model";

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

export interface Logo {
  light: string;
  dark: string;
  favicon: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  enabled: boolean;
}

export interface Localization {
  defaultLanguage: string;
  languages: Language[];
}

export interface Layout {
  navigation: {
    isVisible: boolean;
    items: NavigationItem[]; 
  };
}

export interface AppConfig {
  projectName: string;
  logo: Logo;
  theme: Theme;
  features: Features;
  layout: Layout;
  localization: Localization;
  seo: SEO;
}
