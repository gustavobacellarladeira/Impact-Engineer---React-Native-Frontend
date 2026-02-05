/**
 * Transaction API Service
 * Simulates API calls with realistic network delays and error scenarios
 */

import { sortedMockTransactions } from '../data/mockTransactions';
import {
  Transaction,
  TransactionApiResponse,
  TransactionFilters,
} from '../types';

// Simulate network delay
const SIMULATED_DELAY_MS = 800;

// Simulate random errors for testing (set to 0 to disable)
const ERROR_PROBABILITY = 0.1; // 10% chance of error

/**
 * Simulates fetching transactions from an API
 * Includes artificial delay to mimic network latency
 */
export const fetchTransactions = async (
  filters?: TransactionFilters,
): Promise<TransactionApiResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate random network errors
      if (Math.random() < ERROR_PROBABILITY) {
        reject({
          success: false,
          data: [],
          error:
            'Network error: Unable to fetch transactions. Please try again.',
        });
        return;
      }

      let transactions = [...sortedMockTransactions];

      // Apply type filter
      if (filters?.type && filters.type !== 'all') {
        transactions = transactions.filter(t => t.type === filters.type);
      }

      // Apply search filter (case-insensitive)
      if (filters?.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        transactions = transactions.filter(t =>
          t.merchant.toLowerCase().includes(query),
        );
      }

      resolve({
        success: true,
        data: transactions,
      });
    }, SIMULATED_DELAY_MS);
  });
};

/**
 * Fetches a single transaction by ID
 */
export const fetchTransactionById = async (
  id: string,
): Promise<Transaction | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const transaction = sortedMockTransactions.find(t => t.id === id);
      resolve(transaction || null);
    }, SIMULATED_DELAY_MS / 2);
  });
};
