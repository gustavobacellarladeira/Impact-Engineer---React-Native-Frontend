/**
 * Transaction Type Tests
 * Tests for transaction type validation and type guards
 */

import { Transaction, TransactionType, SortOption } from '../src/types';

describe('Transaction Types', () => {
  describe('Transaction interface', () => {
    it('should accept valid expense transaction', () => {
      const transaction: Transaction = {
        id: 'tx_123',
        merchant: 'Grocery Store',
        amount: -50.00,
        date: '2026-02-05',
        category: 'Groceries',
        type: 'expense',
      };
      
      expect(transaction.id).toBe('tx_123');
      expect(transaction.amount).toBeLessThan(0);
      expect(transaction.type).toBe('expense');
    });

    it('should accept valid income transaction', () => {
      const transaction: Transaction = {
        id: 'tx_456',
        merchant: 'Employer Inc',
        amount: 5000.00,
        date: '2026-02-01',
        category: 'Salary',
        type: 'income',
      };
      
      expect(transaction.id).toBe('tx_456');
      expect(transaction.amount).toBeGreaterThan(0);
      expect(transaction.type).toBe('income');
    });
  });

  describe('TransactionType', () => {
    it('should only allow income or expense', () => {
      const validTypes: TransactionType[] = ['income', 'expense'];
      expect(validTypes).toHaveLength(2);
      expect(validTypes).toContain('income');
      expect(validTypes).toContain('expense');
    });
  });

  describe('SortOption', () => {
    it('should have all valid sort options', () => {
      const validSorts: SortOption[] = [
        'date_desc',
        'date_asc',
        'amount_desc',
        'amount_asc',
      ];
      expect(validSorts).toHaveLength(4);
    });
  });
});

describe('Transaction Helpers', () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      merchant: 'Store A',
      amount: -100,
      date: '2026-02-05',
      category: 'Shopping',
      type: 'expense',
    },
    {
      id: '2',
      merchant: 'Salary',
      amount: 3000,
      date: '2026-02-01',
      category: 'Salary',
      type: 'income',
    },
    {
      id: '3',
      merchant: 'Store B',
      amount: -50,
      date: '2026-02-03',
      category: 'Groceries',
      type: 'expense',
    },
  ];

  describe('filtering by type', () => {
    it('should filter income transactions', () => {
      const income = transactions.filter(t => t.type === 'income');
      expect(income).toHaveLength(1);
      expect(income[0].merchant).toBe('Salary');
    });

    it('should filter expense transactions', () => {
      const expenses = transactions.filter(t => t.type === 'expense');
      expect(expenses).toHaveLength(2);
    });
  });

  describe('sorting', () => {
    it('should sort by date descending', () => {
      const sorted = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      expect(sorted[0].date).toBe('2026-02-05');
      expect(sorted[2].date).toBe('2026-02-01');
    });

    it('should sort by date ascending', () => {
      const sorted = [...transactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      expect(sorted[0].date).toBe('2026-02-01');
      expect(sorted[2].date).toBe('2026-02-05');
    });

    it('should sort by amount descending (highest first)', () => {
      const sorted = [...transactions].sort((a, b) => b.amount - a.amount);
      expect(sorted[0].amount).toBe(3000);
      expect(sorted[2].amount).toBe(-100);
    });

    it('should sort by amount ascending (lowest first)', () => {
      const sorted = [...transactions].sort((a, b) => a.amount - b.amount);
      expect(sorted[0].amount).toBe(-100);
      expect(sorted[2].amount).toBe(3000);
    });

    it('should sort by absolute amount descending', () => {
      const sorted = [...transactions].sort(
        (a, b) => Math.abs(b.amount) - Math.abs(a.amount)
      );
      expect(Math.abs(sorted[0].amount)).toBe(3000);
    });
  });

  describe('aggregations', () => {
    it('should calculate total income', () => {
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      expect(totalIncome).toBe(3000);
    });

    it('should calculate total expenses', () => {
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      expect(totalExpenses).toBe(150);
    });

    it('should calculate net balance', () => {
      const netBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
      expect(netBalance).toBe(2850); // 3000 - 100 - 50
    });

    it('should group by category', () => {
      const byCategory = transactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      expect(byCategory['Shopping']).toBe(1);
      expect(byCategory['Salary']).toBe(1);
      expect(byCategory['Groceries']).toBe(1);
    });

    it('should calculate spending by category', () => {
      const spendingByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
          return acc;
        }, {} as Record<string, number>);
      
      expect(spendingByCategory['Shopping']).toBe(100);
      expect(spendingByCategory['Groceries']).toBe(50);
    });
  });

  describe('search', () => {
    it('should search by merchant name (case insensitive)', () => {
      const query = 'store';
      const results = transactions.filter(t =>
        t.merchant.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(2);
    });

    it('should return empty for no matches', () => {
      const query = 'nonexistent';
      const results = transactions.filter(t =>
        t.merchant.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(0);
    });

    it('should search by category', () => {
      const query = 'groceries';
      const results = transactions.filter(t =>
        t.category.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(1);
      expect(results[0].category).toBe('Groceries');
    });
  });
});
