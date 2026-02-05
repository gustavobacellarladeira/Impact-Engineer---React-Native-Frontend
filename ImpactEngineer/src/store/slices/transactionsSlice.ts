/**
 * Transactions Filters Slice
 * Manages filter state (data is handled by RTK Query)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionFilters, SortOption, CategoryFilter } from '../../types';

interface FiltersState {
  filters: TransactionFilters;
}

const initialState: FiltersState = {
  filters: {
    type: 'all',
    searchQuery: '',
    category: 'all',
    sortBy: 'date_desc',
  },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setTypeFilter: (
      state,
      action: PayloadAction<TransactionFilters['type']>,
    ) => {
      state.filters.type = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<CategoryFilter>) => {
      state.filters.category = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.filters.sortBy = action.payload;
    },
    resetFilters: state => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setTypeFilter,
  setSearchQuery,
  setCategoryFilter,
  setSortBy,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
