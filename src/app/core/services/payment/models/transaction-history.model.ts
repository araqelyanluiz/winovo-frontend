export interface Transaction {
   id: number;
  telegram_id: string;
  order_id: string;
  currency: string;
  method: string;
  status: string;
  balance_before: string;
  balance_after: string;
  deposit: string;
  withdraw: string;
  net_amount: string;
  freerounds_used: number;
  bonus_id: number;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface TransactionHistoryResponse {
  data: Transaction[];
  message: string;
  pagination: Pagination;
  status: number;
}
