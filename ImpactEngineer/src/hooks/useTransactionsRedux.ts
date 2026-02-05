/**
 * useTransactionsRedux Hook
 * RTK Query + Redux powered transaction data management
 */

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
  useUpdateTransactionCategoryMutation,
} from '../store/api';
import {
  setTypeFilter as setTypeFilterAction,
  setSearchQuery as setSearchQueryAction,
  setCategoryFilter as setCategoryFilterAction,
  setSortBy as setSortByAction,
} from '../store/slices';
import { selectTransactionFilters, selectIsFiltered } from '../store/selectors';
import {
  TransactionFilters,
  SortOption,
  CategoryFilter,
  DateSection,
  Transaction,
} from '../types';
import { getDateSection } from '../utils/date';

export function useTransactionsRedux() {
  const dispatch = useAppDispatch();

  // RTK Query for data fetching with automatic caching
  const {
    data: allTransactions = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetTransactionsQuery();

  // Mutation hooks for delete and update
  const [deleteTransactionMutation] = useDeleteTransactionMutation();
  const [updateCategoryMutation] = useUpdateTransactionCategoryMutation();

  // Filters from Redux store
  const filters = useAppSelector(selectTransactionFilters);
  const isFiltered = useAppSelector(selectIsFiltered);

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

  // Refresh (refetch from API)
  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Retry on error
  const retry = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Delete a transaction
  const deleteTransaction = useCallback(
    async (id: string) => {
      try {
        await deleteTransactionMutation(id).unwrap();
        return { success: true };
      } catch (err) {
        console.error('Failed to delete transaction:', err);
        return { success: false, error: err };
      }
    },
    [deleteTransactionMutation],
  );

  // Update transaction category
  const updateTransactionCategory = useCallback(
    async (id: string, category: string) => {
      try {
        await updateCategoryMutation({ id, category }).unwrap();
        return { success: true };
      } catch (err) {
        console.error('Failed to update transaction category:', err);
        return { success: false, error: err };
      }
    },
    [updateCategoryMutation],
  );

  // Error message extraction
  const errorMessage = error
    ? 'status' in error
      ? (error.data as { message?: string })?.message || 'An error occurred'
      : error.message || 'An error occurred'
    : null;

  return {
    transactions,
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
    refresh,
    retry,
    deleteTransaction,
    updateTransactionCategory,
  };
}
