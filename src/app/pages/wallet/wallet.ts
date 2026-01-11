import { Component, signal } from '@angular/core';
import { Icon } from '../../shared/components/icon/icon';

interface WalletAction {
  id: string;
  label: string;
  icon: string;
  color: 'green' | 'yellow' | 'purple';
}

interface Balance {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  usdValue: number;
  changePercent: number;
  iconBg: string;
}

@Component({
  selector: 'app-wallet',
  imports: [Icon],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css',
})
export class Wallet {
  totalBalance = signal<number>(10980.5);

  actions: WalletAction[] = [
    { id: 'deposit', label: 'Deposit', icon: 'deposit', color: 'green' },
    { id: 'withdraw', label: 'Withdraw', icon: 'withdraw', color: 'yellow' },
    { id: 'history', label: 'History', icon: 'history', color: 'purple' }
  ];

  balances = signal<Balance[]>([
    {
      id: 'usdt',
      name: 'USDT',
      symbol: 'USDT',
      amount: 1250.00,
      usdValue: 1250.00,
      changePercent: -1.72,
      iconBg: 'bg-emerald-500'
    },
    {
      id: 'btc',
      name: 'BTC',
      symbol: 'BTC',
      amount: 0.0234,
      usdValue: 2457.00,
      changePercent: 0.20,
      iconBg: 'bg-orange-500'
    }
  ]);

  onActionClick(actionId: string): void {
    console.log('Action clicked:', actionId);
  }
}
