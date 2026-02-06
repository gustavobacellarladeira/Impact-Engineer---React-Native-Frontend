/**
 * SearchBar Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../src/components/SearchBar/SearchBar';

// Mock the theme context
jest.mock('../src/theme/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      textPrimary: '#000000',
      textSecondary: '#666666',
      textHint: '#999999',
      surface: '#FFFFFF',
      border: '#E2E8F0',
    },
    isDark: false,
  }),
}));

describe('SearchBar', () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={mockOnChangeText} />
    );
    expect(getByPlaceholderText('Search transactions...')).toBeTruthy();
  });

  it('renders with custom placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar 
        value="" 
        onChangeText={mockOnChangeText}
        placeholder="Search here..."
      />
    );
    expect(getByPlaceholderText('Search here...')).toBeTruthy();
  });

  it('displays the input value', () => {
    const { getByDisplayValue } = render(
      <SearchBar value="Test search" onChangeText={mockOnChangeText} />
    );
    expect(getByDisplayValue('Test search')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={mockOnChangeText} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Search transactions...'), 'new value');
    expect(mockOnChangeText).toHaveBeenCalledWith('new value');
  });

  it('shows clear button when value is not empty', () => {
    const { getByLabelText } = render(
      <SearchBar value="some text" onChangeText={mockOnChangeText} />
    );
    expect(getByLabelText('Clear search')).toBeTruthy();
  });

  it('does not show clear button when value is empty', () => {
    const { queryByLabelText } = render(
      <SearchBar value="" onChangeText={mockOnChangeText} />
    );
    expect(queryByLabelText('Clear search')).toBeNull();
  });

  it('clears search when clear button is pressed', () => {
    const { getByLabelText } = render(
      <SearchBar value="test" onChangeText={mockOnChangeText} />
    );
    
    fireEvent.press(getByLabelText('Clear search'));
    expect(mockOnChangeText).toHaveBeenCalledWith('');
  });

  it('has correct accessibility labels', () => {
    const { getByLabelText } = render(
      <SearchBar value="" onChangeText={mockOnChangeText} />
    );
    expect(getByLabelText('Search transactions')).toBeTruthy();
  });
});
