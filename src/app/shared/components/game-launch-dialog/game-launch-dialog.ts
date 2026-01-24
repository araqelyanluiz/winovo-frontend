import { Component, input, output, signal, effect, inject, ViewEncapsulation, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Game } from '../../../core/services/game/game.model';
import { Icon } from '../icon/icon';
import { GameService } from '../../../core/services/game/game.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TelegramAuthService } from '../../../core/services/telegram/telegram-auth.service';

@Component({
    selector: 'app-game-launch-dialog',
    imports: [Icon],
    templateUrl: './game-launch-dialog.html',
    styleUrl: './game-launch-dialog.css',
    encapsulation: ViewEncapsulation.None,
})
export class GameLaunchDialog {
    private readonly gameService = inject(GameService);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly telegramAuthService = inject(TelegramAuthService);
    private readonly isBrowser = isPlatformBrowser(this.platformId);

    isOpen = input<boolean>(false);
    game = input<Game | null>(null);
    isDemo = input<boolean>(false);
    close = output<void>();

    protected readonly isLoading = signal<boolean>(true);
    protected readonly loadingProgress = signal<number>(0);
    protected readonly gameUrl = signal<SafeResourceUrl | null>(null);
    protected readonly hasError = signal<boolean>(false);
    protected readonly sessionId = signal<string>('');
    protected readonly isFullscreen = signal<boolean>(false); 
    
    constructor() {
        effect(() => {
            if (this.isOpen() && this.game()) {
                this.initializeGame();
            }
        });

        effect(() => {
            if (this.isBrowser) {
                if (this.isOpen()) {
                    document.body.style.overflow = 'hidden';
                    document.body.style.position = 'fixed';
                    document.body.style.width = '100%';
                } else {
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                }
            }
        });
    }

    private initializeGame(): void {
        this.isLoading.set(true);
        this.loadingProgress.set(0);
        this.hasError.set(false);
        this.gameUrl.set(null);

        const progressInterval = setInterval(() => {
            const current = this.loadingProgress();
            if (current < 90) {
                this.loadingProgress.set(current + 10);
            }
        }, 100);

        const currentGame = this.game();
        if (!currentGame) return;

        const initObservable = this.isDemo() 
            ? this.gameService.demoInit(currentGame.id)
            : this.gameService.gameInit(currentGame.id);

        initObservable.subscribe({
            next: (response) => {
                clearInterval(progressInterval);
                this.loadingProgress.set(100);

                setTimeout(() => {
                    if (response?.SessionUrl) {
                        this.gameUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(response.SessionUrl));
                        this.sessionId.set(response.SessionId);
                        this.isLoading.set(false);
                    } else {
                        this.hasError.set(true);
                        this.isLoading.set(false);
                    }
                }, 300);
            },
            error: (error) => {
                clearInterval(progressInterval);
                console.error('Error launching game:', error);
                this.hasError.set(true);
                this.isLoading.set(false);
            },
        });
    }

    protected handleClose(): void {
        this.isFullscreen.set(false);
        
        this.telegramAuthService.refreshUser().subscribe({
            next: () => console.log('User refreshed after game close'),
            error: (err) => console.error('Failed to refresh user:', err)
        });
        
        if (this.sessionId()) {
            this.gameService.closeSession(this.sessionId()).subscribe();
        }
        
        this.close.emit();
    }

    protected toggleFullscreen(): void {
        this.isFullscreen.set(!this.isFullscreen());
    }

    protected reload(): void {
        this.initializeGame();
    }
}
