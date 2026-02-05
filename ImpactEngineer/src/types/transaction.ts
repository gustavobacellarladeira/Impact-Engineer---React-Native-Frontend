/**
 * Transaction Types
 * Core type definitions for the transaction feature
 */

export type TransactionType = 'income' | 'expense';

export type SortOption =
  | 'date_desc'
  | 'date_asc'
  | 'amount_desc'
  | 'amount_asc';

export type CategoryFilter = 'all' | string;

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
  category: CategoryFilter;
  sortBy: SortOption;
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

export interface SortOptionItem {
  key: SortOption;
  label: string;
}

export interface DateSection {
  title: string;
  data: Transaction[];
}
