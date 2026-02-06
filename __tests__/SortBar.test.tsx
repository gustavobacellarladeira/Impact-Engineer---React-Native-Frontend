/**
 * SortBar Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SortBar } from '../src/components/SortBar/SortBar';
import { SortOption } from '../src/types';

// Mock the theme context
jest.mock('../src/theme/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      textPrimary: '#000000',
      textSecondary: '#666666',
      textTertiary: '#999999',
      surfaceSecondary: '#F1F5F9',
      surface: '#FFFFFF',
      primaryLight: '#6366F1',
    },
    isDark: false,
  }),
}));

// Mock haptics
jest.mock('../src/utils/haptics', () => ({
  triggerLightImpact: jest.fn(),
  triggerSelection: jest.fn(),
}));

// Mock Icons
jest.mock('../src/components/Icons', () => ({
  SortIcon: () => null,
  ChevronDownIcon: () => null,
}));

describe('SortBar', () => {
  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default sort option', () => {
    const { getByLabelText } = render(
      <SortBar activeSort="date_desc" onSortChange={mockOnSortChange} />
    );
    expect(getByLabelText('Sort by Newest First')).toBeTruthy();
  });

  it('displays correct label for date_asc', () => {
    const { getByLabelText } = render(
      <SortBar activeSort="date_asc" onSortChange={mockOnSortChange} />
    );
    expect(getByLabelText('Sort by Oldest First')).toBeTruthy();
  });

  it('displays correct label for amount_desc', () => {
    const { getByLabelText } = render(
      <SortBar activeSort="amount_desc" onSortChange={mockOnSortChange} />
    );
    expect(getByLabelText('Sort by Highest Amount')).toBeTruthy();
  });

  it('displays correct label for amount_asc', () => {
    const { getByLabelText } = render(
      <SortBar activeSort="amount_asc" onSortChange={mockOnSortChange} />
    );
    expect(getByLabelText('Sort by Lowest Amount')).toBeTruthy();
  });

  it('opens modal when sort button is pressed', () => {
    const { getByLabelText, getByText } = render(
      <SortBar activeSort="date_desc" onSortChange={mockOnSortChange} />
    );
    
    fireEvent.press(getByLabelText('Sort by Newest First'));
    expect(getByText('Sort By')).toBeTruthy();
  });

  it('shows all sort options in dropdown', () => {
    const { getByLabelText, getAllByText, getByText } = render(
      <SortBar activeSort="date_desc" onSortChange={mockOnSortChange} />
    );
    
    fireEvent.press(getByLabelText('Sort by Newest First'));
    // "Newest First" appears twice: in button and in dropdown
    expect(getAllByText('Newest First').length).toBeGreaterThanOrEqual(1);
    expect(getByText('Oldest First')).toBeTruthy();
    expect(getByText('Highest Amount')).toBeTruthy();
    expect(getByText('Lowest Amount')).toBeTruthy();
  });

  it('calls onSortChange when option is selected', () => {
    const { getByLabelText, getByText } = render(
      <SortBar activeSort="date_desc" onSortChange={mockOnSortChange} />
    );
    
    fireEvent.press(getByLabelText('Sort by Newest First'));
    fireEvent.press(getByText('Highest Amount'));
    expect(mockOnSortChange).toHaveBeenCalledWith('amount_desc');
  });
});
