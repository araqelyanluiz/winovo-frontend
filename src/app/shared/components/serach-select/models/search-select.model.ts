export interface SearchSelectOption {
  id: string;
  label: string;
  value?: string;
  networks?:  string[];
  color?: string;
  minDepositAmount?: number;
  minWithdrawAmount?: number;
  maxWithdrawAmount?: number;
}
