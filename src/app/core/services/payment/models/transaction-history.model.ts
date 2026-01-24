export interface Transaction {
  id: number;
  order_id: string;
  fulgur_transaction_id: string;
  type: string;
  op_type: string;
  status: string;
  address: string;
  amount: string;
  crypto_amount: string;
  currency: string;
  crypto_currency: string;
  description: string;
  telegram_id: number;
  gas: string | null;
  tx_hash: string | null;
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
