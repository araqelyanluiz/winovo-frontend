export type TelegramUserBalances = {
  currency: string;
  balance: number;
  default: boolean;
};

export interface TelegramUser {
  balances: TelegramUserBalances[];
  created_at: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  telegram_id: number;
  username: string;
}
