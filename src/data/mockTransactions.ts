/**
 * Mock Transaction Data
 * Realistic transaction data for development and testing
 * Contains 25+ transactions with a mix of incomes and expenses
 * Uses dynamic dates relative to "today" so filters work correctly
 */

import { Transaction } from '../types';

// Helper function to get date relative to today
const getRelativeDate = (daysAgo: number, hours = 12, minutes = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const mockTransactions: Transaction[] = [
  // Income transactions
  {
    id: '1',
    merchant: 'Direct Deposit - Gerald Inc',
    amount: 3500.0,
    date: getRelativeDate(0, 9, 0), // Today
    category: 'Income',
    type: 'income',
  },
  {
    id: '2',
    merchant: 'Freelance Payment - Web Design',
    amount: 850.0,
    date: getRelativeDate(2, 14, 30), // 2 days ago
    category: 'Income',
    type: 'income',
  },
  {
    id: '3',
    merchant: 'Venmo - John Smith',
    amount: 45.0,
    date: getRelativeDate(4, 18, 20), // 4 days ago
    category: 'Income',
    type: 'income',
  },
  {
    id: '4',
    merchant: 'Tax Refund - IRS',
    amount: 1250.0,
    date: getRelativeDate(8, 10, 0), // 8 days ago
    category: 'Income',
    type: 'income',
  },
  {
    id: '5',
    merchant: 'Dividend - Vanguard',
    amount: 127.5,
    date: getRelativeDate(11, 8, 0), // 11 days ago
    category: 'Investments',
    type: 'income',
  },

  // Expense transactions - Food & Drink
  {
    id: '6',
    merchant: 'Starbucks',
    amount: -6.75,
    date: getRelativeDate(0, 7, 30), // Today
    category: 'Food & Drink',
    type: 'expense',
  },
  {
    id: '7',
    merchant: 'Whole Foods Market',
    amount: -87.32,
    date: getRelativeDate(1, 16, 45), // 1 day ago
    category: 'Groceries',
    type: 'expense',
  },
  {
    id: '8',
    merchant: 'Chipotle Mexican Grill',
    amount: -14.25,
    date: getRelativeDate(1, 12, 30), // 1 day ago
    category: 'Food & Drink',
    type: 'expense',
  },
  {
    id: '9',
    merchant: 'DoorDash - Thai Kitchen',
    amount: -32.99,
    date: getRelativeDate(2, 19, 0), // 2 days ago
    category: 'Food & Drink',
    type: 'expense',
  },
  {
    id: '10',
    merchant: "Trader Joe's",
    amount: -54.18,
    date: getRelativeDate(3, 11, 20), // 3 days ago
    category: 'Groceries',
    type: 'expense',
  },

  // Expense transactions - Shopping
  {
    id: '11',
    merchant: 'Amazon.com',
    amount: -156.78,
    date: getRelativeDate(2, 20, 15), // 2 days ago
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: '12',
    merchant: 'Target',
    amount: -78.43,
    date: getRelativeDate(4, 14, 0), // 4 days ago
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: '13',
    merchant: 'Best Buy',
    amount: -299.99,
    date: getRelativeDate(6, 15, 30), // 6 days ago
    category: 'Electronics',
    type: 'expense',
  },
  {
    id: '14',
    merchant: 'Nike.com',
    amount: -129.0,
    date: getRelativeDate(8, 9, 45), // 8 days ago
    category: 'Shopping',
    type: 'expense',
  },

  // Expense transactions - Bills & Utilities
  {
    id: '15',
    merchant: 'AT&T Wireless',
    amount: -85.0,
    date: getRelativeDate(4, 0, 0), // 4 days ago
    category: 'Bills & Utilities',
    type: 'expense',
  },
  {
    id: '16',
    merchant: 'Netflix',
    amount: -15.99,
    date: getRelativeDate(4, 0, 0), // 4 days ago
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: '17',
    merchant: 'Spotify',
    amount: -10.99,
    date: getRelativeDate(4, 0, 0), // 4 days ago
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: '18',
    merchant: 'PG&E Electric',
    amount: -142.67,
    date: getRelativeDate(5, 0, 0), // 5 days ago
    category: 'Bills & Utilities',
    type: 'expense',
  },
  {
    id: '19',
    merchant: 'Comcast Internet',
    amount: -79.99,
    date: getRelativeDate(7, 0, 0), // 7 days ago
    category: 'Bills & Utilities',
    type: 'expense',
  },

  // Expense transactions - Transportation
  {
    id: '20',
    merchant: 'Shell Gas Station',
    amount: -52.34,
    date: getRelativeDate(3, 8, 15), // 3 days ago
    category: 'Transportation',
    type: 'expense',
  },
  {
    id: '21',
    merchant: 'Uber',
    amount: -24.5,
    date: getRelativeDate(5, 22, 0), // 5 days ago
    category: 'Transportation',
    type: 'expense',
  },
  {
    id: '22',
    merchant: 'SF Parking Garage',
    amount: -18.0,
    date: getRelativeDate(6, 17, 30), // 6 days ago
    category: 'Transportation',
    type: 'expense',
  },

  // Expense transactions - Health & Fitness
  {
    id: '23',
    merchant: 'Equinox Gym',
    amount: -195.0,
    date: getRelativeDate(4, 0, 0), // 4 days ago
    category: 'Health & Fitness',
    type: 'expense',
  },
  {
    id: '24',
    merchant: 'CVS Pharmacy',
    amount: -28.45,
    date: getRelativeDate(7, 13, 20), // 7 days ago
    category: 'Health & Fitness',
    type: 'expense',
  },

  // More income
  {
    id: '25',
    merchant: 'Cash App - Sarah Miller',
    amount: 25.0,
    date: getRelativeDate(9, 16, 0), // 9 days ago
    category: 'Income',
    type: 'income',
  },
  {
    id: '26',
    merchant: 'Interest - Chase Savings',
    amount: 12.35,
    date: getRelativeDate(11, 0, 0), // 11 days ago
    category: 'Income',
    type: 'income',
  },

  // More expenses
  {
    id: '27',
    merchant: 'Apple iTunes',
    amount: -4.99,
    date: getRelativeDate(10, 10, 30), // 10 days ago
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: '28',
    merchant: 'Costco',
    amount: -234.56,
    date: getRelativeDate(12, 11, 0), // 12 days ago
    category: 'Groceries',
    type: 'expense',
  },

  // Additional transactions for more data over time (older)
  {
    id: '29',
    merchant: 'Rent Payment',
    amount: -2200.0,
    date: getRelativeDate(15, 9, 0), // 15 days ago
    category: 'Bills & Utilities',
    type: 'expense',
  },
  {
    id: '30',
    merchant: 'Paycheck - Gerald Inc',
    amount: 3500.0,
    date: getRelativeDate(15, 9, 0), // 15 days ago
    category: 'Income',
    type: 'income',
  },
  {
    id: '31',
    merchant: 'Restaurant - Italian Place',
    amount: -68.5,
    date: getRelativeDate(18, 19, 30), // 18 days ago
    category: 'Food & Drink',
    type: 'expense',
  },
  {
    id: '32',
    merchant: 'Gas Station',
    amount: -45.0,
    date: getRelativeDate(20, 8, 0), // 20 days ago
    category: 'Transportation',
    type: 'expense',
  },
  {
    id: '33',
    merchant: 'Home Depot',
    amount: -189.99,
    date: getRelativeDate(22, 14, 0), // 22 days ago
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: '34',
    merchant: 'Bonus - Gerald Inc',
    amount: 1000.0,
    date: getRelativeDate(25, 9, 0), // 25 days ago
    category: 'Income',
    type: 'income',
  },
  {
    id: '35',
    merchant: 'Insurance Premium',
    amount: -150.0,
    date: getRelativeDate(28, 0, 0), // 28 days ago
    category: 'Bills & Utilities',
    type: 'expense',
  },
];

// Sort transactions by date (most recent first)
export const sortedMockTransactions = [...mockTransactions].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);
