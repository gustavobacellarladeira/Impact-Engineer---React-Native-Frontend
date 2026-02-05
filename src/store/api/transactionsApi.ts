/**
 * Transactions API
 * RTK Query API for transaction data fetching with automatic caching
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Transaction } from '../../types';
import { mockTransactions } from '../../data/mockTransactions';

// Simulated network delay
const NETWORK_DELAY = 800;

// Custom base query that uses mock data
const mockBaseQuery = fetchBaseQuery({ baseUrl: '/' });

// Mock query function
const mockQueryFn = async (
  _arg: void,
  _api: any,
  _extraOptions: any,
  baseQuery: any,
) => {
  // Simulate network delay
  await new Promise<void>(resolve => setTimeout(resolve, NETWORK_DELAY));

  // 10% chance of error for testing
  if (Math.random() < 0.1) {
    return {
      error: {
        status: 500,
        data: { message: 'Server error. Please try again.' },
      },
    };
  }

  // Return sorted transactions (most recent first)
  const sortedTransactions = [...mockTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return { data: sortedTransactions };
};

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: mockBaseQuery,
  tagTypes: ['Transaction'],
  endpoints: builder => ({
    // Get all transactions
    getTransactions: builder.query<Transaction[], void>({
      queryFn: mockQueryFn,
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Transaction' as const, id })),
              { type: 'Transaction', id: 'LIST' },
            ]
          : [{ type: 'Transaction', id: 'LIST' }],
    }),

    // Get single transaction by ID
    getTransactionById: builder.query<Transaction | undefined, string>({
      queryFn: async (id, _api, _extraOptions, _baseQuery) => {
        await new Promise<void>(resolve =>
          setTimeout(resolve, NETWORK_DELAY / 2),
        );
        const transaction = mockTransactions.find(t => t.id === id);
        if (!transaction) {
          return {
            error: {
              status: 404,
              data: { message: 'Transaction not found' },
            },
          };
        }
        return { data: transaction };
      },
      providesTags: (_result, _error, id) => [{ type: 'Transaction', id }],
    }),

    // Delete a transaction
    deleteTransaction: builder.mutation<{ id: string }, string>({
      queryFn: async (id, _api, _extraOptions, _baseQuery) => {
        // Simulate network delay
        await new Promise<void>(resolve => setTimeout(resolve, 300));
        // In a real app, this would delete from the backend
        return { data: { id } };
      },
      // Optimistically update the cache
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        // Optimistic update - remove from cache immediately
        const patchResult = dispatch(
          transactionsApi.util.updateQueryData(
            'getTransactions',
            undefined,
            draft => {
              const index = draft.findIndex(t => t.id === id);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          // Revert on error
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, id) => [{ type: 'Transaction', id }],
    }),

    // Update transaction category
    updateTransactionCategory: builder.mutation<
      Transaction,
      { id: string; category: string }
    >({
      queryFn: async ({ id, category }, _api, _extraOptions, _baseQuery) => {
        // Simulate network delay
        await new Promise<void>(resolve => setTimeout(resolve, 300));
        // Find the transaction and update it
        const transaction = mockTransactions.find(t => t.id === id);
        if (!transaction) {
          return {
            error: {
              status: 404,
              data: { message: 'Transaction not found' },
            },
          };
        }
        const updatedTransaction = { ...transaction, category };
        return { data: updatedTransaction };
      },
      // Optimistically update the cache
      onQueryStarted: async (
        { id, category },
        { dispatch, queryFulfilled },
      ) => {
        // Optimistic update - update category in cache immediately
        const patchResult = dispatch(
          transactionsApi.util.updateQueryData(
            'getTransactions',
            undefined,
            draft => {
              const transaction = draft.find(t => t.id === id);
              if (transaction) {
                transaction.category = category;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          // Revert on error
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Transaction', id },
      ],
    }),

    // Create a new transaction
    createTransaction: builder.mutation<Transaction, Omit<Transaction, 'id'>>({
      queryFn: async (newTransaction, _api, _extraOptions, _baseQuery) => {
        // Simulate network delay
        await new Promise<void>(resolve => setTimeout(resolve, 300));
        // Generate a new ID
        const id = `tx_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const transaction: Transaction = { ...newTransaction, id };
        return { data: transaction };
      },
      // Optimistically update the cache
      onQueryStarted: async (newTransaction, { dispatch, queryFulfilled }) => {
        // Create a temporary ID for optimistic update
        const tempId = `temp_${Date.now()}`;
        const optimisticTransaction: Transaction = {
          ...newTransaction,
          id: tempId,
        };

        // Optimistic update - add to cache immediately
        const patchResult = dispatch(
          transactionsApi.util.updateQueryData(
            'getTransactions',
            undefined,
            draft => {
              draft.unshift(optimisticTransaction);
            },
          ),
        );
        try {
          const { data: createdTransaction } = await queryFulfilled;
          // Replace the optimistic entry with the real one
          dispatch(
            transactionsApi.util.updateQueryData(
              'getTransactions',
              undefined,
              draft => {
                const index = draft.findIndex(t => t.id === tempId);
                if (index !== -1) {
                  draft[index] = createdTransaction;
                }
              },
            ),
          );
        } catch {
          // Revert on error
          patchResult.undo();
        }
      },
      // Don't invalidate tags - we're using optimistic updates and mock data
      // invalidatesTags would refetch and lose the new transaction
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useDeleteTransactionMutation,
  useUpdateTransactionCategoryMutation,
  useCreateTransactionMutation,
} = transactionsApi;
