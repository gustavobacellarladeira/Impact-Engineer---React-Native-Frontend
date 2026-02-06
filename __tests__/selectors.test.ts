/**
 * Transaction Selectors Tests
 * Tests for Redux selectors
 */

import {
  selectTransactionFilters,
  selectTypeFilter,
  selectSearchQuery,
  selectCategoryFilter,
  selectSortBy,
  selectIsFiltered,
  selectCreatedTransactions,
  selectDeletedTransactionIds,
  selectModifiedTransactions,
} from '../src/store/selectors/transactionsSelectors';

describe('Transaction Selectors', () => {
  const mockState = {
    filters: {
      filters: {
        type: 'all' as const,
        searchQuery: '',
        category: 'all' as const,
        sortBy: 'date_desc' as const,
        dateRange: 'all' as const,
      },
    },
    localTransactions: {
      createdTransactions: [
        {
          id: 'local_1',
          merchant: 'Test Store',
          amount: -50,
          date: '2026-02-05',
          category: 'Shopping',
          type: 'expense' as const,
        },
      ],
      deletedTransactionIds: ['mock_1', 'mock_2'],
      modifiedTransactions: {
        mock_3: { category: 'Food' },
      },
      recentlyDeletedLocalTransactions: {},
    },
    // Add other required state slices
    transactionsApi: {} as any,
  };

  describe('selectTransactionFilters', () => {
    it('should return the filters object', () => {
      const result = selectTransactionFilters(mockState);
      expect(result).toEqual(mockState.filters.filters);
    });
  });

  describe('selectTypeFilter', () => {
    it('should return the type filter', () => {
      const result = selectTypeFilter(mockState);
      expect(result).toBe('all');
    });

    it('should return income when set', () => {
      const state = {
        ...mockState,
        filters: {
          filters: { ...mockState.filters.filters, type: 'income' as const },
        },
      };
      const result = selectTypeFilter(state);
      expect(result).toBe('income');
    });
  });

  describe('selectSearchQuery', () => {
    it('should return empty search query', () => {
      const result = selectSearchQuery(mockState);
      expect(result).toBe('');
    });

    it('should return search query when set', () => {
      const state = {
        ...mockState,
        filters: {
          filters: { ...mockState.filters.filters, searchQuery: 'coffee' },
        },
      };
      const result = selectSearchQuery(state);
      expect(result).toBe('coffee');
    });
  });

  describe('selectCategoryFilter', () => {
    it('should return all when no category selected', () => {
      const result = selectCategoryFilter(mockState);
      expect(result).toBe('all');
    });

    it('should return category when selected', () => {
      const state = {
        ...mockState,
        filters: {
          filters: { ...mockState.filters.filters, category: 'Groceries' },
        },
      };
      const result = selectCategoryFilter(state);
      expect(result).toBe('Groceries');
    });
  });

  describe('selectSortBy', () => {
    it('should return default sort option', () => {
      const result = selectSortBy(mockState);
      expect(result).toBe('date_desc');
    });

    it('should return amount_desc when set', () => {
      const state = {
        ...mockState,
        filters: {
          filters: { ...mockState.filters.filters, sortBy: 'amount_desc' as const },
        },
      };
      const result = selectSortBy(state);
      expect(result).toBe('amount_desc');
    });
  });

  describe('selectIsFiltered', () => {
    it('should return false when no filters active', () => {
      const result = selectIsFiltered(mockState);
      expect(result).toBe(false);
    });

    it('should return true when type filter is active', () => {
      const state = {
        ...mockState,
        filters: {
          filters: { ...mockState.filters.filters, type: 'income' as const },
        },
      };
      const result = selectIsFiltered(state);
      expect(result).toBe(true);
    });

    it('should return true when search query is active', () => {
      const state = {
        ...mockState,
        filters: {
          filters: { ...mockState.filters.filters, searchQuery: 'test' },
        },
      };
      const result = selectIsFiltered(state);
      expect(result).toBe(true);
    });

    it('should return true when category filter is active', () => {
      const state = {
        ...mockState,
        filters: {
          filters: { ...mockState.filters.filters, category: 'Food' },
        },
      };
      const result = selectIsFiltered(state);
      expect(result).toBe(true);
    });

    it('should return true when multiple filters are active', () => {
      const state = {
        ...mockState,
        filters: {
          filters: {
            ...mockState.filters.filters,
            type: 'expense' as const,
            searchQuery: 'store',
            category: 'Shopping',
          },
        },
      };
      const result = selectIsFiltered(state);
      expect(result).toBe(true);
    });
  });

  describe('selectCreatedTransactions', () => {
    it('should return created transactions', () => {
      const result = selectCreatedTransactions(mockState);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('local_1');
    });

    it('should return empty array when no transactions', () => {
      const state = {
        ...mockState,
        localTransactions: {
          ...mockState.localTransactions,
          createdTransactions: [],
        },
      };
      const result = selectCreatedTransactions(state);
      expect(result).toHaveLength(0);
    });
  });

  describe('selectDeletedTransactionIds', () => {
    it('should return deleted transaction ids', () => {
      const result = selectDeletedTransactionIds(mockState);
      expect(result).toEqual(['mock_1', 'mock_2']);
    });

    it('should return empty array when no deletions', () => {
      const state = {
        ...mockState,
        localTransactions: {
          ...mockState.localTransactions,
          deletedTransactionIds: [],
        },
      };
      const result = selectDeletedTransactionIds(state);
      expect(result).toHaveLength(0);
    });
  });

  describe('selectModifiedTransactions', () => {
    it('should return modified transactions', () => {
      const result = selectModifiedTransactions(mockState);
      expect(result).toEqual({ mock_3: { category: 'Food' } });
    });

    it('should return empty object when no modifications', () => {
      const state = {
        ...mockState,
        localTransactions: {
          ...mockState.localTransactions,
          modifiedTransactions: {},
        },
      };
      const result = selectModifiedTransactions(state);
      expect(result).toEqual({});
    });
  });

  describe('selector memoization', () => {
    it('should return same reference for same state', () => {
      const result1 = selectTransactionFilters(mockState);
      const result2 = selectTransactionFilters(mockState);
      expect(result1).toBe(result2);
    });

    it('should return new reference when state changes', () => {
      const result1 = selectTransactionFilters(mockState);
      const newState = {
        ...mockState,
        filters: {
          filters: { ...mockState.filters.filters, searchQuery: 'new' },
        },
      };
      const result2 = selectTransactionFilters(newState);
      expect(result1).not.toBe(result2);
    });
  });
});
