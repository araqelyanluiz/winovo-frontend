import { SearchSelectOption } from '../../../../shared/components/serach-select/models/search-select.model';

export const AVAILABLE_CURRENCIES: SearchSelectOption[] = [
  {
    id: 'ftnf',
    label: 'FTN (BPRC-20)',
    value: 'FTNF',
    color: '#FF6B35',
    minDepositAmount: 10,
    minWithdrawAmount: 10,
    maxWithdrawAmount: 100000
  },
  {
    id: 'btc',
    label: 'Bitcoin',
    value: 'BTC',
    color: '#F7931A',
    minDepositAmount: 0.0001,
    minWithdrawAmount: 0.001,
    maxWithdrawAmount: 10
  },
  {
    id: 'eth',
    label: 'Ethereum',
    value: 'ETH',
    color: '#627EEA',
    minDepositAmount: 0.001,
    minWithdrawAmount: 0.01,
    maxWithdrawAmount: 100
  },
  {
    id: 'usdt',
    label: 'Tether(ERC-20)',
    value: 'USDT',
    color: '#26A17B',
    minDepositAmount: 10,
    minWithdrawAmount: 10,
    maxWithdrawAmount: 50000
  },
  {
    id: 'usdt_t',
    label: 'Tether(TRC-20)',
    value: 'USDT_T',
    color: '#26A17B',
    minDepositAmount: 10,
    minWithdrawAmount: 10,
    maxWithdrawAmount: 50000
  },
  {
    id: 'trx',
    label: 'Tron',
    value: 'TRX',
    color: '#FF060A',
    minDepositAmount: 100,
    minWithdrawAmount: 100,
    maxWithdrawAmount: 1000000
  },
  {
    id: 'usdc',
    label: 'USD Coin',
    value: 'USDC',
    color: '#2775CA',
    minDepositAmount: 10,
    minWithdrawAmount: 10,
    maxWithdrawAmount: 50000
  },
  {
    id: 'bnbb',
    label: 'Binance Coin (BEP-20)',
    value: 'BNBB',
    color: '#F3BA2F',
    minDepositAmount: 0.01,
    minWithdrawAmount: 0.01,
    maxWithdrawAmount: 100
  },
  {
    id: 'usdb',
    label: 'USDT (BEP-20)',
    value: 'USDB',
    color: '#F3BA2F',
    minDepositAmount: 10,
    minWithdrawAmount: 10,
    maxWithdrawAmount: 50000
  },
  {
    id: 'ltc',
    label: 'LTC',
    value: 'LTC',
    color: '#345D9D',
    minDepositAmount: 0.01,
    minWithdrawAmount: 0.01,
    maxWithdrawAmount: 100
  },
  {
    id: 'dai',
    label: 'DAI (ERC-20)',
    value: 'DAI',
    color: '#F4B731',
    minDepositAmount: 10,
    minWithdrawAmount: 10,
    maxWithdrawAmount: 50000
  },
  {
    id: 'bnb',
    label: 'BNB (ERC-20)',
    value: 'BNB',
    color: '#F3BA2F',
    minDepositAmount: 0.01,
    minWithdrawAmount: 0.01,
    maxWithdrawAmount: 100
  },
  {
    id: 'ton',
    label: 'TON',
    value: 'TON',
    color: '#0088CC',
    minDepositAmount: 1,
    minWithdrawAmount: 1,
    maxWithdrawAmount: 10000
  }
];
