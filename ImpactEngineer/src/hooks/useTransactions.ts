/**
 * useTransactions Hook
 * Manages transaction data fetching, filtering, and state
 */

import { useCallback, useEffect, useState } from 'react';
import { fetchTransactions } from '../services/transactionService';
import { Transaction, TransactionFilters } from '../types';
import { useDebounce } from './useDebounce';

interface UseTransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

interface UseTransactionsReturn extends UseTransactionsState {
  filters: TransactionFilters;
  setTypeFilter: (type: TransactionFilters['type']) => void;
  setSearchQuery: (query: string) => void;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
}

const DEBOUNCE_DELAY = 300;

export function useTransactions(): UseTransactionsReturn {
  const [state, setState] = useState<UseTransactionsState>({
    transactions: [],
    isLoading: true,
    isRefreshing: false,
    error: null,
  });

  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all',
    searchQuery: '',
  });

  // Debounce search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(filters.searchQuery, DEBOUNCE_DELAY);

  const loadTransactions = useCallback(
    async (isRefresh: boolean = false) => {
      setState(prev => ({
        ...prev,
        isLoading: !isRefresh,
        isRefreshing: isRefresh,
        error: null,
      }));

      try {
        const response = await fetchTransactions({
          ...filters,
          searchQuery: debouncedSearchQuery,
        });

        if (response.success) {
          setState(prev => ({
            ...prev,
            transactions: response.data,
            isLoading: false,
            isRefreshing: false,
            error: null,
          }));
        } else {
          throw new Error(response.error || 'Failed to fetch transactions');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred. Please try again.';

        setState(prev => ({
          ...prev,
          isLoading: false,
          isRefreshing: false,
          error: errorMessage,
        }));
      }
    },
    [filters.type, debouncedSearchQuery],
  );

  // Initial load and reload on filter changes
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const setTypeFilter = useCallback((type: TransactionFilters['type']) => {
    setFilters(prev => ({ ...prev, type }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const refresh = useCallback(async () => {
    await loadTransactions(true);
  }, [loadTransactions]);

  const retry = useCallback(async () => {
    await loadTransactions(false);
  }, [loadTransactions]);

  return {
    ...state,
    filters,
    setTypeFilter,
    setSearchQuery,
    refresh,
    retry,
  };
}
