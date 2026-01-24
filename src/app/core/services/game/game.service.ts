import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, map, shareReplay, tap } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Game, Provider } from "./game.model";
import { GameListResponse, ProviderListResponse, GameInitRequest, GameInitResponse, GameInitData } from "./game-response.model";
import { TelegramAuthService } from "../telegram/telegram-auth.service";
import { LocalizationService } from "../localization/localization.service";

export interface GameBottomSheetState {
  isOpen: boolean;
  game: Game | null;
  isDemo: boolean;
}

export interface GameLaunchDialogState {
  isOpen: boolean;
  game: Game | null;
  isDemo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
    private readonly http = inject(HttpClient);
    private readonly telegramAuthService = inject(TelegramAuthService);
    private readonly localizationService = inject(LocalizationService);
    private API_URL = environment.apiUrl;
    private readonly projectKey = environment.projectKey;

    readonly games = signal<Game[]>([]);
    readonly providers = signal<Provider[]>([]);
    readonly isLoading = signal<boolean>(false);
    readonly totalGames = signal<number>(0);
    readonly currentPage = signal<number>(1);
    readonly hasMoreGames = signal<boolean>(true);
    
    private bottomSheetState = signal<GameBottomSheetState>({
      isOpen: false,
      game: null,
      isDemo: false
    });
    
    readonly gameBottomSheetState = this.bottomSheetState.asReadonly();

    private gameLaunchDialogState = signal<GameLaunchDialogState>({
      isOpen: false,
      game: null,
      isDemo: false
    });
    
    readonly launchDialogState = this.gameLaunchDialogState.asReadonly();

    private providers$: Observable<Provider[]> | null = null;

    getGames(page: number = 1, limit: number = 30, append: boolean = false, providerName?: string): Observable<GameListResponse> {
        this.isLoading.set(true);
        let params = new HttpParams()
            .set('bankGroupId', this.projectKey)
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (providerName && providerName !== 'All') {
            params = params.set('provider', providerName);
        }

        console.log('Fetching games with params:', { page, limit, append, providerName });

        return this.http.get<GameListResponse>(`${this.API_URL}/games/list`, { params }).pipe(
            tap(response => {
                console.log('Games response:', response);
                if (append && this.games().length > 0) {
                    const existingIds = new Set(this.games().map(g => g.id));
                    const newGames = response.result.filter(g => !existingIds.has(g.id));
                    this.games.set([...this.games(), ...newGames]);
                } else {
                    this.games.set(response.result);
                }
                this.totalGames.set(response.meta.totalGames);
                this.currentPage.set(response.meta.page);
                this.hasMoreGames.set(response.meta.page < response.meta.totalPages);
                this.isLoading.set(false);
            })
        );
    }

    loadMoreGames(providerName?: string): void {
        if (this.hasMoreGames() && !this.isLoading()) {
            const nextPage = this.currentPage() + 1;
            this.getGames(nextPage, 30, true, providerName).subscribe();
        }
    }

    resetGames(providerName?: string): void {
        this.games.set([]);
        this.currentPage.set(1);
        this.hasMoreGames.set(true);
        this.getGames(1, 30, false, providerName).subscribe();
    }

    getGamesByTagType(tagType: string): Game[] {
        return this.games().filter(game => game.tagType === tagType);
    }

    getGamesByTag(tagType: string, limit: number = 10): Observable<GameListResponse> {
        const params = new HttpParams()
            .set('bankGroupId', this.projectKey)
            .set('tagType', tagType)
            .set('limit', limit.toString());

        return this.http.get<GameListResponse>(`${this.API_URL}/games/list`, { params });
    }

    getProviders(): Observable<Provider[]> {
        if (this.providers().length > 0) {
            return this.providers$!;
        }

        if (!this.providers$) {
            this.providers$ = this.http.get<ProviderListResponse>(`${this.API_URL}/get/providers-config`).pipe(
                map(response => response.providers),
                tap(providers => this.providers.set(providers)),
                shareReplay(1)
            );
        }
        return this.providers$;
    }
    

    gameInit(gameId: string): Observable<GameInitData> {
        const user = this.telegramAuthService.user();
        
        const requestBody: GameInitRequest = {
            PlayerId: user?.telegram_id?.toString() ,
            BankGroupId: this.projectKey,
            Nick: user?.username ?? user?.first_name ,
            GameId: gameId,
            Currency: user?.projectCurrency,
            Lang: this.localizationService.getCurrentLanguageCode()
        };

        return this.http.post<GameInitResponse>(`${this.API_URL}/session/launch`, requestBody).pipe(
            map(response => response.result)
        );
    }

    demoInit(gameId: string): Observable<GameInitData> {
        const requestBody: GameInitRequest = {
            BankGroupId: this.projectKey,
            GameId: gameId,
        };

        return this.http.post<GameInitResponse>(`${this.API_URL}/session/demo`, requestBody).pipe(
            map(response => response.result)
        );
    }

    openGameBottomSheet(game: Game | undefined, isDemo: boolean = false): void {
        if (!game) return;
        this.bottomSheetState.set({
            isOpen: true,
            game,
            isDemo
        });
    }

    closeGameBottomSheet(): void {
        this.bottomSheetState.set({
            isOpen: false,
            game: null,
            isDemo: false
        });
    }

    openGameLaunchDialog(game: Game | null, isDemo: boolean = false): void {
        if (!game) return;
        this.gameLaunchDialogState.set({
            isOpen: true,
            game,
            isDemo
        });
    }

    closeGameLaunchDialog(): void {
        this.gameLaunchDialogState.set({
            isOpen: false,
            game: null,
            isDemo: false
        });
    }

    closeSession(sessionId: string): Observable<GameInitData> {
        const requestBody = {
            "sessionId": sessionId
        };
        return this.http.post<GameInitResponse>(`${this.API_URL}/session/close`, requestBody).pipe(
            map(response => {
                return response.result;
            })
        );
    }
}