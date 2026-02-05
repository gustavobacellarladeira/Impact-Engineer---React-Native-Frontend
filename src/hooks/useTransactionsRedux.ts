/**
 * useTransactionsRedux Hook
 * RTK Query + Redux powered transaction data management
 * Uses local persistence for created/edited/deleted transactions
 */

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useGetTransactionsQuery } from '../store/api';
import {
  setTypeFilter as setTypeFilterAction,
  setSearchQuery as setSearchQueryAction,
  setCategoryFilter as setCategoryFilterAction,
  setSortBy as setSortByAction,
  setDateRange as setDateRangeAction,
  addTransaction as addTransactionAction,
  deleteTransaction as deleteTransactionAction,
  undoDeleteTransaction as undoDeleteTransactionAction,
  undoDeleteTransactions as undoDeleteTransactionsAction,
  updateTransactionCategory as updateTransactionCategoryAction,
  updateTransaction as updateTransactionAction,
} from '../store/slices';
import {
  selectTransactionFilters,
  selectIsFiltered,
  selectCreatedTransactions,
  selectDeletedTransactionIds,
  selectModifiedTransactions,
} from '../store/selectors';
import {
  TransactionFilters,
  SortOption,
  CategoryFilter,
  DateSection,
  Transaction,
  DateRangeFilter,
} from '../types';
import { getDateSection } from '../utils/date';

// Helper function to check if date is within range
function isDateInRange(dateStr: string, range: DateRangeFilter): boolean {
  if (range === 'all') return true;

  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case 'today':
      return date >= today;
    case 'week': {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }
    case 'month': {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return date >= monthAgo;
    }
    default:
      return true;
  }
}

export function useTransactionsRedux() {
  const dispatch = useAppDispatch();

  // RTK Query for fetching mock data (base data)
  const {
    data: mockTransactions = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetTransactionsQuery();

  // Local transactions state (persisted)
  const createdTransactions = useAppSelector(selectCreatedTransactions);
  const deletedTransactionIds = useAppSelector(selectDeletedTransactionIds);
  const modifiedTransactions = useAppSelector(selectModifiedTransactions);

  // Filters from Redux store
  const filters = useAppSelector(selectTransactionFilters);
  const isFiltered = useAppSelector(selectIsFiltered);

  // Combine mock + local transactions, apply modifications and deletions
  const allTransactions = useMemo(() => {
    // Start with mock transactions, apply modifications and filter deletions
    const processedMockTransactions = mockTransactions
      .filter(t => !deletedTransactionIds.includes(t.id))
      .map(t => {
        const modifications = modifiedTransactions[t.id];
        if (modifications) {
          return { ...t, ...modifications };
        }
        return t;
      });

    // Add locally created transactions (already up to date)
    return [...createdTransactions, ...processedMockTransactions];
  }, [
    mockTransactions,
    createdTransactions,
    deletedTransactionIds,
    modifiedTransactions,
  ]);

  // Filter and sort transactions (memoized)
  const transactions = useMemo(() => {
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
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(t => t.merchant.toLowerCase().includes(query));
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange !== 'all') {
      result = result.filter(t => isDateInRange(t.date, filters.dateRange));
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
  }, [allTransactions, filters]);

  // Group transactions by date sections
  const sections = useMemo((): DateSection[] => {
    const sectionMap = new Map<string, Transaction[]>();

    transactions.forEach(transaction => {
      const sectionTitle = getDateSection(transaction.date);
      const existing = sectionMap.get(sectionTitle) || [];
      sectionMap.set(sectionTitle, [...existing, transaction]);
    });

    const sectionOrder = ['Today', 'Yesterday', 'All'];

    return sectionOrder
      .filter(title => sectionMap.has(title))
      .map(title => ({
        title,
        data: sectionMap.get(title) || [],
      }));
  }, [transactions]);

  // Unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allTransactions.map(t => t.category));
    return Array.from(uniqueCategories).sort();
  }, [allTransactions]);

  // Filter actions
  const setTypeFilter = useCallback(
    (type: TransactionFilters['type']) => {
      dispatch(setTypeFilterAction(type));
    },
    [dispatch],
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQueryAction(query));
    },
    [dispatch],
  );

  const setCategoryFilterFn = useCallback(
    (category: CategoryFilter) => {
      dispatch(setCategoryFilterAction(category));
    },
    [dispatch],
  );

  const setSortBy = useCallback(
    (sort: SortOption) => {
      dispatch(setSortByAction(sort));
    },
    [dispatch],
  );

  const setDateRange = useCallback(
    (range: DateRangeFilter) => {
      dispatch(setDateRangeAction(range));
    },
    [dispatch],
  );

  // Refresh (refetch from API)
  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Retry on error
  const retry = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Delete a transaction (persisted locally)
  const deleteTransaction = useCallback(
    (id: string) => {
      dispatch(deleteTransactionAction(id));
      return { success: true };
    },
    [dispatch],
  );

  // Undo delete a transaction
  const undoDeleteTransaction = useCallback(
    (id: string) => {
      dispatch(undoDeleteTransactionAction(id));
    },
    [dispatch],
  );

  // Undo delete multiple transactions
  const undoDeleteTransactions = useCallback(
    (ids: string[]) => {
      dispatch(undoDeleteTransactionsAction(ids));
    },
    [dispatch],
  );

  // Update transaction category (persisted locally)
  const updateTransactionCategory = useCallback(
    (id: string, category: string) => {
      dispatch(updateTransactionCategoryAction({ id, category }));
      return { success: true };
    },
    [dispatch],
  );

  // Update transaction fully (persisted locally)
  const updateTransaction = useCallback(
    (id: string, updates: Partial<Transaction>) => {
      dispatch(updateTransactionAction({ id, updates }));
      return { success: true };
    },
    [dispatch],
  );

  // Create a new transaction (persisted locally)
  const createTransaction = useCallback(
    (transaction: Omit<Transaction, 'id'>) => {
      const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newTransaction: Transaction = { ...transaction, id };
      dispatch(addTransactionAction(newTransaction));
      return { success: true, data: newTransaction };
    },
    [dispatch],
  );

  // Error message extraction
  const errorMessage = error
    ? 'status' in error
      ? (error.data as { message?: string })?.message || 'An error occurred'
      : error.message || 'An error occurred'
    : null;

  return {
    transactions,
    allTransactions,
    sections,
    categories,
    filters,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    error: errorMessage,
    isFiltered,
    setTypeFilter,
    setSearchQuery,
    setCategoryFilter: setCategoryFilterFn,
    setSortBy,
    setDateRange,
    refresh,
    retry,
    deleteTransaction,
    undoDeleteTransaction,
    undoDeleteTransactions,
    updateTransactionCategory,
    updateTransaction,
    createTransaction,
  };
}
