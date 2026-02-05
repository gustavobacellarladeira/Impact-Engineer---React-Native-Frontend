/**
 * Mock Transaction Data Tests
 */

import {
  mockTransactions,
  sortedMockTransactions,
} from '../src/data/mockTransactions';

describe('mockTransactions', () => {
  it('has at least 20 transactions', () => {
    expect(mockTransactions.length).toBeGreaterThanOrEqual(20);
  });

  it('has transactions with all required fields', () => {
    mockTransactions.forEach(transaction => {
      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('merchant');
      expect(transaction).toHaveProperty('amount');
      expect(transaction).toHaveProperty('date');
      expect(transaction).toHaveProperty('category');
      expect(transaction).toHaveProperty('type');
    });
  });

  it('has both income and expense transactions', () => {
    const incomeTransactions = mockTransactions.filter(
      t => t.type === 'income',
    );
    const expenseTransactions = mockTransactions.filter(
      t => t.type === 'expense',
    );

    expect(incomeTransactions.length).toBeGreaterThan(0);
    expect(expenseTransactions.length).toBeGreaterThan(0);
  });

  it('income transactions have positive amounts', () => {
    const incomeTransactions = mockTransactions.filter(
      t => t.type === 'income',
    );
    incomeTransactions.forEach(t => {
      expect(t.amount).toBeGreaterThan(0);
    });
  });

  it('expense transactions have negative amounts', () => {
    const expenseTransactions = mockTransactions.filter(
      t => t.type === 'expense',
    );
    expenseTransactions.forEach(t => {
      expect(t.amount).toBeLessThan(0);
    });
  });

  it('all transactions have valid ISO date format', () => {
    mockTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      expect(date.toString()).not.toBe('Invalid Date');
    });
  });
});

describe('sortedMockTransactions', () => {
  it('is sorted by date (most recent first)', () => {
    for (let i = 1; i < sortedMockTransactions.length; i++) {
      const currentDate = new Date(sortedMockTransactions[i].date).getTime();
      const previousDate = new Date(
        sortedMockTransactions[i - 1].date,
      ).getTime();
      expect(previousDate).toBeGreaterThanOrEqual(currentDate);
    }
  });
});
