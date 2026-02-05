/**
 * Mock Transaction Data
 * Realistic transaction data for development and testing
 * Contains 25+ transactions with a mix of incomes and expenses
 */

import { Transaction } from '../types';

export const mockTransactions: Transaction[] = [
  // Income transactions
  {
    id: '1',
    merchant: 'Direct Deposit - Gerald Inc',
    amount: 3500.0,
    date: '2026-02-05T09:00:00.000Z',
    category: 'Income',
    type: 'income',
  },
  {
    id: '2',
    merchant: 'Freelance Payment - Web Design',
    amount: 850.0,
    date: '2026-02-03T14:30:00.000Z',
    category: 'Income',
    type: 'income',
  },
  {
    id: '3',
    merchant: 'Venmo - John Smith',
    amount: 45.0,
    date: '2026-02-01T18:20:00.000Z',
    category: 'Income',
    type: 'income',
  },
  {
    id: '4',
    merchant: 'Tax Refund - IRS',
    amount: 1250.0,
    date: '2026-01-28T10:00:00.000Z',
    category: 'Income',
    type: 'income',
  },
  {
    id: '5',
    merchant: 'Dividend - Vanguard',
    amount: 127.5,
    date: '2026-01-25T08:00:00.000Z',
    category: 'Investments',
    type: 'income',
  },

  // Expense transactions - Food & Drink
  {
    id: '6',
    merchant: 'Starbucks',
    amount: -6.75,
    date: '2026-02-05T07:30:00.000Z',
    category: 'Food & Drink',
    type: 'expense',
  },
  {
    id: '7',
    merchant: 'Whole Foods Market',
    amount: -87.32,
    date: '2026-02-04T16:45:00.000Z',
    category: 'Groceries',
    type: 'expense',
  },
  {
    id: '8',
    merchant: 'Chipotle Mexican Grill',
    amount: -14.25,
    date: '2026-02-04T12:30:00.000Z',
    category: 'Food & Drink',
    type: 'expense',
  },
  {
    id: '9',
    merchant: 'DoorDash - Thai Kitchen',
    amount: -32.99,
    date: '2026-02-03T19:00:00.000Z',
    category: 'Food & Drink',
    type: 'expense',
  },
  {
    id: '10',
    merchant: "Trader Joe's",
    amount: -54.18,
    date: '2026-02-02T11:20:00.000Z',
    category: 'Groceries',
    type: 'expense',
  },

  // Expense transactions - Shopping
  {
    id: '11',
    merchant: 'Amazon.com',
    amount: -156.78,
    date: '2026-02-03T20:15:00.000Z',
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: '12',
    merchant: 'Target',
    amount: -78.43,
    date: '2026-02-01T14:00:00.000Z',
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: '13',
    merchant: 'Best Buy',
    amount: -299.99,
    date: '2026-01-30T15:30:00.000Z',
    category: 'Electronics',
    type: 'expense',
  },
  {
    id: '14',
    merchant: 'Nike.com',
    amount: -129.0,
    date: '2026-01-28T09:45:00.000Z',
    category: 'Shopping',
    type: 'expense',
  },

  // Expense transactions - Bills & Utilities
  {
    id: '15',
    merchant: 'AT&T Wireless',
    amount: -85.0,
    date: '2026-02-01T00:00:00.000Z',
    category: 'Bills & Utilities',
    type: 'expense',
  },
  {
    id: '16',
    merchant: 'Netflix',
    amount: -15.99,
    date: '2026-02-01T00:00:00.000Z',
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: '17',
    merchant: 'Spotify',
    amount: -10.99,
    date: '2026-02-01T00:00:00.000Z',
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: '18',
    merchant: 'PG&E Electric',
    amount: -142.67,
    date: '2026-01-31T00:00:00.000Z',
    category: 'Bills & Utilities',
    type: 'expense',
  },
  {
    id: '19',
    merchant: 'Comcast Internet',
    amount: -79.99,
    date: '2026-01-29T00:00:00.000Z',
    category: 'Bills & Utilities',
    type: 'expense',
  },

  // Expense transactions - Transportation
  {
    id: '20',
    merchant: 'Shell Gas Station',
    amount: -52.34,
    date: '2026-02-02T08:15:00.000Z',
    category: 'Transportation',
    type: 'expense',
  },
  {
    id: '21',
    merchant: 'Uber',
    amount: -24.5,
    date: '2026-01-31T22:00:00.000Z',
    category: 'Transportation',
    type: 'expense',
  },
  {
    id: '22',
    merchant: 'SF Parking Garage',
    amount: -18.0,
    date: '2026-01-30T17:30:00.000Z',
    category: 'Transportation',
    type: 'expense',
  },

  // Expense transactions - Health & Fitness
  {
    id: '23',
    merchant: 'Equinox Gym',
    amount: -195.0,
    date: '2026-02-01T00:00:00.000Z',
    category: 'Health & Fitness',
    type: 'expense',
  },
  {
    id: '24',
    merchant: 'CVS Pharmacy',
    amount: -28.45,
    date: '2026-01-29T13:20:00.000Z',
    category: 'Health & Fitness',
    type: 'expense',
  },

  // More income
  {
    id: '25',
    merchant: 'Cash App - Sarah Miller',
    amount: 25.0,
    date: '2026-01-27T16:00:00.000Z',
    category: 'Income',
    type: 'income',
  },
  {
    id: '26',
    merchant: 'Interest - Chase Savings',
    amount: 12.35,
    date: '2026-01-25T00:00:00.000Z',
    category: 'Income',
    type: 'income',
  },

  // More expenses
  {
    id: '27',
    merchant: 'Apple iTunes',
    amount: -4.99,
    date: '2026-01-26T10:30:00.000Z',
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: '28',
    merchant: 'Costco',
    amount: -234.56,
    date: '2026-01-24T11:00:00.000Z',
    category: 'Groceries',
    type: 'expense',
  },
];

// Sort transactions by date (most recent first)
export const sortedMockTransactions = [...mockTransactions].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);
