import { FooterConfig } from "../../../layout/footer/footer.model";
import { NavigationItem } from "../../../layout/navigation/navigation.model";

export interface Theme {
  primary: string;
  secondary: string;
  skin1: string;
  purple900: string;
  success: string;
  warning: string;
  danger: string;
}

export interface Features {
  
}

export interface SEO {
  title: string;
  description: string;
  keywords: string[];
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
  footer: FooterConfig;
}

export interface PageSection {
  id: string;
  feature: string;
  enabled: boolean;
  order: number;
}

export interface Pages {
  home?: {
    sections: PageSection[];
  };
  [key: string]: any;
}

export interface AppConfig {
  projectName: string;
  logo: string;
  supportChatLink?: string;
  theme: Theme;
  features: Features;
  pages?: Pages;
  layout: Layout;
  localization: Localization;
  seo: SEO;
}
