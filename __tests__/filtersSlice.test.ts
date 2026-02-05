/**
 * Filters Slice Tests
 * Tests for the Redux filters slice
 */

import filtersReducer, {
  setTypeFilter,
  setSearchQuery,
  setCategoryFilter,
  setSortBy,
  setDateRange,
  resetFilters,
} from '../src/store/slices/transactionsSlice';

describe('filtersSlice', () => {
  const initialState = {
    filters: {
      type: 'all' as const,
      searchQuery: '',
      category: 'all' as const,
      sortBy: 'date_desc' as const,
      dateRange: 'all' as const,
    },
  };

  describe('setTypeFilter', () => {
    it('should set type filter to income', () => {
      const state = filtersReducer(initialState, setTypeFilter('income'));
      expect(state.filters.type).toBe('income');
    });

    it('should set type filter to expense', () => {
      const state = filtersReducer(initialState, setTypeFilter('expense'));
      expect(state.filters.type).toBe('expense');
    });

    it('should set type filter to all', () => {
      const modifiedState = { ...initialState, filters: { ...initialState.filters, type: 'income' as const } };
      const state = filtersReducer(modifiedState, setTypeFilter('all'));
      expect(state.filters.type).toBe('all');
    });
  });

  describe('setSearchQuery', () => {
    it('should set search query', () => {
      const state = filtersReducer(initialState, setSearchQuery('coffee'));
      expect(state.filters.searchQuery).toBe('coffee');
    });

    it('should handle empty search query', () => {
      const modifiedState = { ...initialState, filters: { ...initialState.filters, searchQuery: 'test' } };
      const state = filtersReducer(modifiedState, setSearchQuery(''));
      expect(state.filters.searchQuery).toBe('');
    });

    it('should handle search query with special characters', () => {
      const state = filtersReducer(initialState, setSearchQuery('Café & Tea'));
      expect(state.filters.searchQuery).toBe('Café & Tea');
    });
  });

  describe('setCategoryFilter', () => {
    it('should set category filter to groceries', () => {
      const state = filtersReducer(initialState, setCategoryFilter('Groceries'));
      expect(state.filters.category).toBe('Groceries');
    });

    it('should set category filter to entertainment', () => {
      const state = filtersReducer(initialState, setCategoryFilter('Entertainment'));
      expect(state.filters.category).toBe('Entertainment');
    });

    it('should reset category filter to all', () => {
      const modifiedState = { ...initialState, filters: { ...initialState.filters, category: 'Groceries' as const } };
      const state = filtersReducer(modifiedState, setCategoryFilter('all'));
      expect(state.filters.category).toBe('all');
    });
  });

  describe('setSortBy', () => {
    it('should set sort to date ascending', () => {
      const state = filtersReducer(initialState, setSortBy('date_asc'));
      expect(state.filters.sortBy).toBe('date_asc');
    });

    it('should set sort to amount descending', () => {
      const state = filtersReducer(initialState, setSortBy('amount_desc'));
      expect(state.filters.sortBy).toBe('amount_desc');
    });

    it('should set sort to amount ascending', () => {
      const state = filtersReducer(initialState, setSortBy('amount_asc'));
      expect(state.filters.sortBy).toBe('amount_asc');
    });
  });

  describe('setDateRange', () => {
    it('should set date range to last 7 days', () => {
      const state = filtersReducer(initialState, setDateRange('last_7_days'));
      expect(state.filters.dateRange).toBe('last_7_days');
    });

    it('should set date range to last 30 days', () => {
      const state = filtersReducer(initialState, setDateRange('last_30_days'));
      expect(state.filters.dateRange).toBe('last_30_days');
    });

    it('should set date range to this month', () => {
      const state = filtersReducer(initialState, setDateRange('this_month'));
      expect(state.filters.dateRange).toBe('this_month');
    });
  });

  describe('resetFilters', () => {
    it('should reset all filters to initial state', () => {
      const modifiedState = {
        filters: {
          type: 'income' as const,
          searchQuery: 'test',
          category: 'Groceries' as const,
          sortBy: 'amount_desc' as const,
          dateRange: 'last_7_days' as const,
        },
      };
      const state = filtersReducer(modifiedState, resetFilters());
      expect(state).toEqual(initialState);
    });
  });
});
