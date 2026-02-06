/**
 * FilterBar Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FilterBar } from '../src/components/FilterBar/FilterBar';
import { FilterButtonType } from '../src/types';

// Mock the theme context
jest.mock('../src/theme/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      filterInactive: '#F1F5F9',
      filterActive: '#6366F1',
      border: '#E2E8F0',
      filterInactiveText: '#64748B',
      filterActiveText: '#FFFFFF',
      background: '#F8FAFC',
    },
    isDark: false,
  }),
}));

// Mock haptics
jest.mock('../src/utils/haptics', () => ({
  triggerLightImpact: jest.fn(),
}));

describe('FilterBar', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter options', () => {
    const { getByText } = render(
      <FilterBar activeFilter="all" onFilterChange={mockOnFilterChange} />
    );
    expect(getByText('All')).toBeTruthy();
    expect(getByText('Income')).toBeTruthy();
    expect(getByText('Expenses')).toBeTruthy();
  });

  it('calls onFilterChange when All is pressed', () => {
    const { getByText } = render(
      <FilterBar activeFilter="income" onFilterChange={mockOnFilterChange} />
    );
    fireEvent.press(getByText('All'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('all');
  });

  it('calls onFilterChange when Income is pressed', () => {
    const { getByText } = render(
      <FilterBar activeFilter="all" onFilterChange={mockOnFilterChange} />
    );
    fireEvent.press(getByText('Income'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('income');
  });

  it('calls onFilterChange when Expenses is pressed', () => {
    const { getByText } = render(
      <FilterBar activeFilter="all" onFilterChange={mockOnFilterChange} />
    );
    fireEvent.press(getByText('Expenses'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('expense');
  });

  it('renders with expense filter active', () => {
    const { getByText } = render(
      <FilterBar activeFilter="expense" onFilterChange={mockOnFilterChange} />
    );
    expect(getByText('Expenses')).toBeTruthy();
  });
});
