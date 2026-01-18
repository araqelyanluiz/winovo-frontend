import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, map, shareReplay, tap } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Game, Provider } from "./game.model";
import { GameListResponse, ProviderListResponse, GameInitRequest, GameInitResponse, GameInitData } from "./game-response.model";
import { TelegramAuthService } from "../telegram/telegram-auth.service";
import { LocalizationService } from "../localization/localization.service";

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

    private games$: Observable<Game[]> | null = null;
    private providers$: Observable<Provider[]> | null = null;

    getGames(): Observable<Game[]> {
        if (this.games().length > 0) {
            return this.games$!;
        }

        if (!this.games$) {
            this.isLoading.set(true);
            const params = new HttpParams().set('bankGroupId', this.projectKey);
            this.games$ = this.http.get<GameListResponse>(`${this.API_URL}/games/list`, { params: params }).pipe(
                map(response => response.result),
                tap(games => {
                    this.games.set(games);
                    this.isLoading.set(false);
                }),
                shareReplay(1)
            );
        }
        return this.games$;
    }

    getGamesByTagType(tagType: string): Observable<Game[]> {
        return this.getGames().pipe(
            map(games => games.filter(game => game.tagType === tagType))
        );
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

    closeSeession(SessionId: string): Observable<GameInitData> {
        const requestBody = {
            "sessionId": SessionId
        }
       return this.http.post<GameInitResponse>(`${this.API_URL}/session/close`, requestBody).pipe(
            map(response => {
                return response.result;
            })
            
        );
    }
}