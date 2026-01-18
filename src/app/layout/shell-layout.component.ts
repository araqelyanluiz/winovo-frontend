import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navigation } from "./navigation/navigation";
import { Footer } from "./footer/footer";
import { Header } from "./header/header";
import { TelegramAuthService } from '../core/services/telegram/telegram-auth.service';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-shell-layout',
  imports: [RouterOutlet, Header, Footer, Navigation],
  template: `
    <div class="min-h-screen flex flex-col max-w-3xl mx-auto bg-skin1">
        <div class="flex flex-col">
            <app-header />
            <main class="flex-1 pt-15">
                <router-outlet />
            </main>
            <app-footer />
        </div>
        <app-navigation />
    </div>
  `,
})
export class ShellLayoutComponent implements OnInit, OnDestroy {
  private readonly telegramAuthService = inject(TelegramAuthService);
  private readonly router = inject(Router);
  private backButtonHandler?: () => void;

  ngOnInit(): void {
    const webApp = this.telegramAuthService.getWebApp();
    console.log('ShellLayout: WebApp available:', !!webApp);
    console.log('ShellLayout: BackButton available:', !!(webApp && webApp.BackButton));
    
    if (webApp?.BackButton) {
      this.backButtonHandler = () => {
        console.log('BackButton clicked, navigating to /home');
        this.router.navigate(['/home']);
      };
      
      try {
        webApp.BackButton.onClick(this.backButtonHandler);
        console.log('BackButton handler registered');
        
        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
          console.log('Navigation ended:', event.url);
          if (event.url === '/home' || event.url === '/') {
            webApp.BackButton.hide();
          } else {
            webApp.BackButton.show();
          }
        });
      } catch (error) {
        console.error('Error setting up BackButton:', error);
      }
    } else {
      console.warn('BackButton not available in this Telegram client');
    }
  }

  ngOnDestroy(): void {
    const webApp = this.telegramAuthService.getWebApp();
    if (webApp && webApp.BackButton && this.backButtonHandler) {
      webApp.BackButton.offClick(this.backButtonHandler);
      webApp.BackButton.hide();
    }
  }
}
