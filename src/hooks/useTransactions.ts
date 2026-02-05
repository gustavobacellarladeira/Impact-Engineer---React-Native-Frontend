/**
 * useTransactions Hook
 * Manages transaction data fetching, filtering, sorting, and state
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchTransactions } from '../services/transactionService';
import {
  Transaction,
  TransactionFilters,
  SortOption,
  CategoryFilter,
  DateSection,
} from '../types';
import { useDebounce } from './useDebounce';
import { getDateSection } from '../utils/date';

interface UseTransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

interface UseTransactionsReturn extends UseTransactionsState {
  filters: TransactionFilters;
  sections: DateSection[];
  categories: string[];
  setTypeFilter: (type: TransactionFilters['type']) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: CategoryFilter) => void;
  setSortBy: (sort: SortOption) => void;
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

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all',
    searchQuery: '',
    category: 'all',
    sortBy: 'date_desc',
    dateRange: 'all',
  });

  // Debounce search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(filters.searchQuery, DEBOUNCE_DELAY);

  // Extract unique categories from all transactions
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allTransactions.map(t => t.category));
    return Array.from(uniqueCategories).sort();
  }, [allTransactions]);

  // Apply filters and sorting locally
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...allTransactions];

    // Filter by type
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    // Filter by search query
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter(t => t.merchant.toLowerCase().includes(query));
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount_desc':
          return Math.abs(b.amount) - Math.abs(a.amount);
        case 'amount_asc':
          return Math.abs(a.amount) - Math.abs(b.amount);
        default:
          return 0;
      }
    });

    return result;
  }, [
    allTransactions,
    filters.type,
    filters.category,
    debouncedSearchQuery,
    filters.sortBy,
  ]);

  // Group transactions by date section
  const sections = useMemo(() => {
    const sectionMap = new Map<string, Transaction[]>();

    filteredAndSortedTransactions.forEach(transaction => {
      const sectionTitle = getDateSection(transaction.date);
      const existing = sectionMap.get(sectionTitle) || [];
      sectionMap.set(sectionTitle, [...existing, transaction]);
    });

    // Define section order
    const sectionOrder = [
      'Today',
      'Yesterday',
      'This Week',
      'This Month',
      'Earlier',
    ];

    return sectionOrder
      .filter(title => sectionMap.has(title))
      .map(title => ({
        title,
        data: sectionMap.get(title) || [],
      }));
  }, [filteredAndSortedTransactions]);

  const loadTransactions = useCallback(async (isRefresh: boolean = false) => {
    setState(prev => ({
      ...prev,
      isLoading: !isRefresh,
      isRefreshing: isRefresh,
      error: null,
    }));

    try {
      // Fetch all transactions without filters (we filter locally)
      const response = await fetchTransactions();

      if (response.success) {
        setAllTransactions(response.data);
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
  }, []);

  // Initial load
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Update transactions state when filtered list changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      transactions: filteredAndSortedTransactions,
    }));
  }, [filteredAndSortedTransactions]);

  const setTypeFilter = useCallback((type: TransactionFilters['type']) => {
    setFilters(prev => ({ ...prev, type }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setCategoryFilter = useCallback((category: CategoryFilter) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy }));
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
    sections,
    categories,
    setTypeFilter,
    setSearchQuery,
    setCategoryFilter,
    setSortBy,
    refresh,
    retry,
  };
}
