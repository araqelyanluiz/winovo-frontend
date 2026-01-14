export interface WalletAction {
  id: string;
  label: string;
  icon: string;
  color: 'green' | 'yellow' | 'purple';
}

export interface Balance {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  usdValue: number;
  changePercent: number;
  iconBg: string;
}
