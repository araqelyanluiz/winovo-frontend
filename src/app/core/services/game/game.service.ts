import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Game, Provider } from "./game.model";
import { GameListResponse, ProviderListResponse } from "./game-response.model";

@Injectable({
  providedIn: 'root'
})
export class GameService {
    private readonly http = inject(HttpClient);
    private API_URL = environment.apiUrl;
    private readonly projectKey = environment.projectKey;

    getGames(): Observable<Game[]> {
        const params = new HttpParams().set('bankGroupId', this.projectKey);
        return this.http.get<GameListResponse>(`${this.API_URL}/games/list`, { params: params }).pipe(
            map(response => response.result)
        );
    }

    getGamesByTagType(tagType: string): Observable<Game[]> {
        return this.getGames().pipe(
            map(games => games.filter(game => game.tagType === tagType))
        );
    }

    getProviders(): Observable<Provider[]> {
        return this.http.get<ProviderListResponse>(`${this.API_URL}/get/providers-config`).pipe(
            map(response => response.providers)
        );
    }
}