export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterConfig {
  isVisible: boolean;
  links: FooterLink[];
  content: string;
  copyright: string;
}
