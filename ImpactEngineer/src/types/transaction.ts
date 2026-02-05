/**
 * Transaction Types
 * Core type definitions for the transaction feature
 */

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  merchant: string;
  amount: number; // positive for income, negative for expenses
  date: string; // ISO 8601 format
  category: string;
  type: TransactionType;
}

export interface TransactionFilters {
  type: 'all' | TransactionType;
  searchQuery: string;
}

export interface TransactionApiResponse {
  data: Transaction[];
  success: boolean;
  error?: string;
}

export type FilterButtonType = 'all' | 'income' | 'expense';

export interface FilterOption {
  key: FilterButtonType;
  label: string;
}
