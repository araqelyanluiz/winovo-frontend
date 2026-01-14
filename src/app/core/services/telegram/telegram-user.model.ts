export type TelegramUserBalances = Record<string, number>;

export interface TelegramUser {
  balances: TelegramUserBalances;
  created_at: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  telegram_id: number;
  username: string;
}
