/**
 * TransactionItem Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionItem } from '../src/components/TransactionItem/TransactionItem';
import { Transaction } from '../src/types';

// Mock the theme context
jest.mock('../src/theme/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      textPrimary: '#000000',
      textSecondary: '#666666',
      textHint: '#999999',
      primary: '#6366F1',
      surface: '#FFFFFF',
      background: '#F8FAFC',
      income: '#10B981',
      expense: '#EF4444',
      categoryBackground: '#F1F5F9',
    },
    isDark: false,
  }),
}));

// Mock haptics
jest.mock('../src/utils/haptics', () => ({
  triggerLightImpact: jest.fn(),
}));

// Mock Icons
jest.mock('../src/components/Icons', () => ({
  getCategoryIcon: () => () => null,
}));

describe('TransactionItem', () => {
  const mockExpenseTransaction: Transaction = {
    id: 'tx_1',
    merchant: 'Coffee Shop',
    amount: -4.50,
    date: '2026-02-05T10:30:00Z',
    category: 'Food & Dining',
    type: 'expense',
  };

  const mockIncomeTransaction: Transaction = {
    id: 'tx_2',
    merchant: 'Employer Inc',
    amount: 5000.00,
    date: '2026-02-01T09:00:00Z',
    category: 'Salary',
    type: 'income',
  };

  it('renders expense transaction correctly', () => {
    const { getByText } = render(
      <TransactionItem transaction={mockExpenseTransaction} />
    );
    expect(getByText('Coffee Shop')).toBeTruthy();
    expect(getByText(/Food & Dining/)).toBeTruthy();
  });

  it('renders income transaction correctly', () => {
    const { getByText } = render(
      <TransactionItem transaction={mockIncomeTransaction} />
    );
    expect(getByText('Employer Inc')).toBeTruthy();
    expect(getByText(/Salary/)).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <TransactionItem transaction={mockExpenseTransaction} onPress={mockOnPress} />
    );
    fireEvent.press(getByRole('button'));
    expect(mockOnPress).toHaveBeenCalledWith(mockExpenseTransaction);
  });

  it('shows correct amount formatting for expense', () => {
    const { getByText } = render(
      <TransactionItem transaction={mockExpenseTransaction} />
    );
    expect(getByText(/-\$4\.50/)).toBeTruthy();
  });

  it('shows correct amount formatting for income', () => {
    const { getByText } = render(
      <TransactionItem transaction={mockIncomeTransaction} />
    );
    expect(getByText(/\+\$5,000\.00/)).toBeTruthy();
  });

  it('has correct accessibility label', () => {
    const { getByLabelText } = render(
      <TransactionItem transaction={mockExpenseTransaction} />
    );
    expect(getByLabelText(/Coffee Shop/)).toBeTruthy();
  });

  it('renders without onPress handler', () => {
    const { getByText } = render(
      <TransactionItem transaction={mockExpenseTransaction} />
    );
    expect(getByText('Coffee Shop')).toBeTruthy();
  });
});
