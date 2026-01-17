export interface GameListResponse {
  result: Game[];
}

export interface ProviderListResponse {
  providers: Provider[];
}

export interface GameInitRequest {
  PlayerId?: string;
  BankGroupId: string;
  Nick?: string;
  GameId: string;
  Currency?: string;
  Lang?: string;
}

export interface GameInitData {
  SessionUrl: string;
  SessionId: string;
}

export interface GameInitResponse {
  result: GameInitData;
}

import { Game, Provider } from './game.model';
