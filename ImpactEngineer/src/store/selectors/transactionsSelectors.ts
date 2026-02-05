/**
 * Transaction Selectors
 * Memoized selectors for filter state
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selector for filters state
const selectFiltersState = (state: RootState) => state.filters;

// Filters
export const selectTransactionFilters = createSelector(
  selectFiltersState,
  state => state.filters,
);

// Individual filter selectors
export const selectTypeFilter = createSelector(
  selectTransactionFilters,
  filters => filters.type,
);

export const selectSearchQuery = createSelector(
  selectTransactionFilters,
  filters => filters.searchQuery,
);

export const selectCategoryFilter = createSelector(
  selectTransactionFilters,
  filters => filters.category,
);

export const selectSortBy = createSelector(
  selectTransactionFilters,
  filters => filters.sortBy,
);

// Check if filters are active
export const selectIsFiltered = createSelector(
  selectTransactionFilters,
  filters => {
    return (
      filters.type !== 'all' ||
      filters.searchQuery.length > 0 ||
      filters.category !== 'all'
    );
  },
);
