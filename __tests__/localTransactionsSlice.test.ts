/**
 * Local Transactions Slice Tests
 * Tests for the Redux local transactions slice
 */

import localTransactionsReducer, {
  addTransaction,
  deleteTransaction,
  undoDeleteTransaction,
  updateTransactionCategory,
  clearLocalTransactions,
} from '../src/store/slices/localTransactionsSlice';
import { Transaction } from '../src/types';

describe('localTransactionsSlice', () => {
  const mockTransaction: Transaction = {
    id: 'local_123',
    merchantName: 'Test Store',
    amount: -50.00,
    date: '2026-02-05',
    category: 'Shopping',
    type: 'expense',
  };

  const mockIncomeTransaction: Transaction = {
    id: 'local_456',
    merchantName: 'Salary',
    amount: 5000.00,
    date: '2026-02-01',
    category: 'Salary',
    type: 'income',
  };

  const initialState = {
    createdTransactions: [] as Transaction[],
    deletedTransactionIds: [] as string[],
    modifiedTransactions: {} as Record<string, Partial<Transaction>>,
    recentlyDeletedLocalTransactions: {} as Record<string, Transaction>,
  };

  describe('addTransaction', () => {
    it('should add a new transaction to the beginning of the list', () => {
      const state = localTransactionsReducer(initialState, addTransaction(mockTransaction));
      expect(state.createdTransactions).toHaveLength(1);
      expect(state.createdTransactions[0]).toEqual(mockTransaction);
    });

    it('should add multiple transactions in order', () => {
      let state = localTransactionsReducer(initialState, addTransaction(mockTransaction));
      state = localTransactionsReducer(state, addTransaction(mockIncomeTransaction));
      expect(state.createdTransactions).toHaveLength(2);
      expect(state.createdTransactions[0]).toEqual(mockIncomeTransaction);
      expect(state.createdTransactions[1]).toEqual(mockTransaction);
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a locally created transaction', () => {
      const stateWithTransaction = {
        ...initialState,
        createdTransactions: [mockTransaction],
      };
      const state = localTransactionsReducer(stateWithTransaction, deleteTransaction('local_123'));
      expect(state.createdTransactions).toHaveLength(0);
      expect(state.recentlyDeletedLocalTransactions['local_123']).toEqual(mockTransaction);
    });

    it('should add mock transaction id to deletedTransactionIds', () => {
      const state = localTransactionsReducer(initialState, deleteTransaction('mock_tx_1'));
      expect(state.deletedTransactionIds).toContain('mock_tx_1');
    });

    it('should not duplicate deleted ids', () => {
      let state = localTransactionsReducer(initialState, deleteTransaction('mock_tx_1'));
      state = localTransactionsReducer(state, deleteTransaction('mock_tx_1'));
      expect(state.deletedTransactionIds.filter(id => id === 'mock_tx_1')).toHaveLength(1);
    });

    it('should remove modifications when deleting', () => {
      const stateWithMods = {
        ...initialState,
        modifiedTransactions: { 'mock_tx_1': { category: 'Food' } },
      };
      const state = localTransactionsReducer(stateWithMods, deleteTransaction('mock_tx_1'));
      expect(state.modifiedTransactions['mock_tx_1']).toBeUndefined();
    });
  });

  describe('undoDeleteTransaction', () => {
    it('should restore a locally deleted transaction', () => {
      const stateWithDeleted = {
        ...initialState,
        recentlyDeletedLocalTransactions: { 'local_123': mockTransaction },
      };
      const state = localTransactionsReducer(stateWithDeleted, undoDeleteTransaction('local_123'));
      expect(state.createdTransactions).toHaveLength(1);
      expect(state.createdTransactions[0]).toEqual(mockTransaction);
      expect(state.recentlyDeletedLocalTransactions['local_123']).toBeUndefined();
    });

    it('should remove mock transaction id from deletedTransactionIds', () => {
      const stateWithDeleted = {
        ...initialState,
        deletedTransactionIds: ['mock_tx_1', 'mock_tx_2'],
      };
      const state = localTransactionsReducer(stateWithDeleted, undoDeleteTransaction('mock_tx_1'));
      expect(state.deletedTransactionIds).not.toContain('mock_tx_1');
      expect(state.deletedTransactionIds).toContain('mock_tx_2');
    });
  });

  describe('updateTransactionCategory', () => {
    it('should update category of a local transaction', () => {
      const stateWithTransaction = {
        ...initialState,
        createdTransactions: [mockTransaction],
      };
      const state = localTransactionsReducer(
        stateWithTransaction,
        updateTransactionCategory({ id: 'local_123', category: 'Food' })
      );
      expect(state.createdTransactions[0].category).toBe('Food');
    });

    it('should add modification for mock transaction', () => {
      const state = localTransactionsReducer(
        initialState,
        updateTransactionCategory({ id: 'mock_tx_1', category: 'Entertainment' })
      );
      expect(state.modifiedTransactions['mock_tx_1']).toEqual({ category: 'Entertainment' });
    });

    it('should merge with existing modifications', () => {
      const stateWithMods = {
        ...initialState,
        modifiedTransactions: { 'mock_tx_1': { merchantName: 'Updated Name' } },
      };
      const state = localTransactionsReducer(
        stateWithMods,
        updateTransactionCategory({ id: 'mock_tx_1', category: 'Food' })
      );
      expect(state.modifiedTransactions['mock_tx_1']).toEqual({
        merchantName: 'Updated Name',
        category: 'Food',
      });
    });
  });

  describe('clearLocalTransactions', () => {
    it('should clear all local data', () => {
      const stateWithData = {
        createdTransactions: [mockTransaction],
        deletedTransactionIds: ['mock_1', 'mock_2'],
        modifiedTransactions: { 'mock_3': { category: 'Food' } },
        recentlyDeletedLocalTransactions: { 'local_456': mockIncomeTransaction },
      };
      const state = localTransactionsReducer(stateWithData, clearLocalTransactions());
      expect(state).toEqual(initialState);
    });
  });

  describe('migration safety', () => {
    it('should handle undefined recentlyDeletedLocalTransactions', () => {
      const stateWithoutRecent = {
        createdTransactions: [mockTransaction],
        deletedTransactionIds: [],
        modifiedTransactions: {},
        // recentlyDeletedLocalTransactions is missing (simulating old persisted state)
      } as any;
      
      // Should not throw
      expect(() => {
        localTransactionsReducer(stateWithoutRecent, deleteTransaction('local_123'));
      }).not.toThrow();
    });
  });
});
