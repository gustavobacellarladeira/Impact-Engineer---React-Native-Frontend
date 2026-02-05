/**
 * Local Transactions Slice
 * Manages locally created/edited/deleted transactions that persist across app restarts
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types';

interface LocalTransactionsState {
  // Transactions created locally
  createdTransactions: Transaction[];
  // IDs of transactions that have been deleted
  deletedTransactionIds: string[];
  // Transactions that have been modified (keyed by ID)
  modifiedTransactions: Record<string, Partial<Transaction>>;
  // Recently deleted local transactions (for undo) - keyed by ID
  recentlyDeletedLocalTransactions: Record<string, Transaction>;
}

const initialState: LocalTransactionsState = {
  createdTransactions: [],
  deletedTransactionIds: [],
  modifiedTransactions: {},
  recentlyDeletedLocalTransactions: {},
};

const localTransactionsSlice = createSlice({
  name: 'localTransactions',
  initialState,
  reducers: {
    // Add a newly created transaction
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.createdTransactions.unshift(action.payload);
    },

    // Mark a transaction as deleted
    deleteTransaction: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      // If it's a locally created transaction, move it to recently deleted
      const localIndex = state.createdTransactions.findIndex(t => t.id === id);
      if (localIndex !== -1) {
        // Save to recently deleted for undo
        state.recentlyDeletedLocalTransactions[id] =
          state.createdTransactions[localIndex];
        state.createdTransactions.splice(localIndex, 1);
      } else {
        // Otherwise mark it as deleted
        if (!state.deletedTransactionIds.includes(id)) {
          state.deletedTransactionIds.push(id);
        }
      }
      // Also remove any modifications
      delete state.modifiedTransactions[id];
    },

    // Undo a deletion
    undoDeleteTransaction: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      // Check if it was a local transaction
      const localTransaction = state.recentlyDeletedLocalTransactions[id];
      if (localTransaction) {
        // Restore the local transaction
        state.createdTransactions.unshift(localTransaction);
        delete state.recentlyDeletedLocalTransactions[id];
      } else {
        // Remove from deleted IDs (mock transaction)
        const index = state.deletedTransactionIds.indexOf(id);
        if (index !== -1) {
          state.deletedTransactionIds.splice(index, 1);
        }
      }
    },

    // Undo multiple deletions
    undoDeleteTransactions: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(id => {
        // Check if it was a local transaction
        const localTransaction = state.recentlyDeletedLocalTransactions[id];
        if (localTransaction) {
          state.createdTransactions.unshift(localTransaction);
          delete state.recentlyDeletedLocalTransactions[id];
        } else {
          const index = state.deletedTransactionIds.indexOf(id);
          if (index !== -1) {
            state.deletedTransactionIds.splice(index, 1);
          }
        }
      });
    },

    // Clear old recently deleted transactions (cleanup)
    clearRecentlyDeleted: state => {
      state.recentlyDeletedLocalTransactions = {};
    },

    // Update a transaction's category
    updateTransactionCategory: (
      state,
      action: PayloadAction<{ id: string; category: string }>,
    ) => {
      const { id, category } = action.payload;
      // Check if it's a local transaction
      const localTransaction = state.createdTransactions.find(t => t.id === id);
      if (localTransaction) {
        localTransaction.category = category;
      } else {
        // Update in modifications
        state.modifiedTransactions[id] = {
          ...state.modifiedTransactions[id],
          category,
        };
      }
    },

    // Update a transaction fully
    updateTransaction: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Transaction> }>,
    ) => {
      const { id, updates } = action.payload;
      // Check if it's a local transaction
      const localTransaction = state.createdTransactions.find(t => t.id === id);
      if (localTransaction) {
        Object.assign(localTransaction, updates);
      } else {
        // Update in modifications
        state.modifiedTransactions[id] = {
          ...state.modifiedTransactions[id],
          ...updates,
        };
      }
    },

    // Clear all local data (for testing/reset)
    clearLocalTransactions: state => {
      state.createdTransactions = [];
      state.deletedTransactionIds = [];
      state.modifiedTransactions = {};
      state.recentlyDeletedLocalTransactions = {};
    },
  },
});

export const {
  addTransaction,
  deleteTransaction,
  undoDeleteTransaction,
  undoDeleteTransactions,
  clearRecentlyDeleted,
  updateTransactionCategory,
  updateTransaction,
  clearLocalTransactions,
} = localTransactionsSlice.actions;

export default localTransactionsSlice.reducer;
