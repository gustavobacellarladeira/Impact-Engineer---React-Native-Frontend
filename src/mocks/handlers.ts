/**
 * MSW Handlers
 * Mock Service Worker request handlers for API mocking
 * NOTE: This file is kept for reference but no longer used.
 *       RTK Query's queryFn provides mock data directly.
 */

import { http, HttpResponse, delay } from 'msw';
import { mockTransactions } from '../data/mockTransactions';
import { Transaction } from '../types';

// Simulated network delay (ms)
const NETWORK_DELAY = 800;

// Error rate (10% chance of error)
const ERROR_RATE = 0.1;

export const handlers = [
  // GET /api/transactions
  http.get('/api/transactions', async () => {
    // Simulate network delay
    await delay(NETWORK_DELAY);

    // Random error simulation
    if (Math.random() < ERROR_RATE) {
      return HttpResponse.json(
        { error: 'Server error. Please try again.' },
        { status: 500 },
      );
    }

    // Return sorted transactions (most recent first)
    const sortedTransactions = [...mockTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return HttpResponse.json(sortedTransactions);
  }),

  // GET /api/transactions/:id
  http.get('/api/transactions/:id', async ({ params }) => {
    await delay(NETWORK_DELAY / 2);

    const { id } = params;
    const transaction = mockTransactions.find((t: Transaction) => t.id === id);

    if (!transaction) {
      return HttpResponse.json(
        { error: 'Transaction not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(transaction);
  }),

  // POST /api/transactions (for future use)
  http.post('/api/transactions', async ({ request }) => {
    await delay(NETWORK_DELAY);

    const newTransaction = (await request.json()) as Partial<Transaction>;

    return HttpResponse.json(
      {
        ...newTransaction,
        id: `txn_${Date.now()}`,
      } as Transaction,
      { status: 201 },
    );
  }),
];
