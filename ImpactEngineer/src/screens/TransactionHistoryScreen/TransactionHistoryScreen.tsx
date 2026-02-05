/**
 * TransactionHistoryScreen
 * Main screen displaying the user's transaction history with filtering capabilities
 */

import React, { useCallback, useMemo, useState, useRef } from 'react';
import {
  SectionList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  SectionListRenderItemInfo,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  BalanceSummary,
  CategoryFilterBar,
  CategoryPickerModal,
  CreateTransactionModal,
  EmptyState,
  ErrorState,
  FilterBar,
  SearchBar,
  SectionHeader,
  SortBar,
  SwipeableTransactionItem,
  TransactionDetailModal,
  TransactionSkeleton,
  ThemeToggle,
  UndoToast,
  SuccessToast,
  StatsPanel,
  TRANSACTION_ITEM_HEIGHT,
} from '../../components';
import { useTransactionsRedux as useTransactions } from '../../hooks';
import { useTheme } from '../../theme';
import { spacing, typography, borderRadius, shadows } from '../../theme';
import {
  triggerSuccess,
  triggerLightImpact,
  triggerWarning,
  triggerMediumImpact,
  triggerError,
  triggerSelection,
} from '../../utils/haptics';
import {
  Transaction,
  FilterButtonType,
  SortOption,
  CategoryFilter,
  DateSection,
} from '../../types';

// Separator height for getItemLayout calculation
const SEPARATOR_HEIGHT = 0;
const ITEM_HEIGHT = TRANSACTION_ITEM_HEIGHT + spacing.xs * 2;
const SECTION_HEADER_HEIGHT = 44;

// Undo timeout duration in milliseconds
const UNDO_TIMEOUT = 5000;

// Delete Icon for FAB
const DeleteIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Close Icon for cancel selection
const CloseIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6l12 12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Plus Icon for create FAB
const PlusIcon = ({ size = 28, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5v14M5 12h14"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export function TransactionHistoryScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    transactions,
    isLoading,
    isRefreshing,
    error,
    filters,
    sections,
    categories,
    setTypeFilter,
    setSearchQuery,
    setCategoryFilter,
    setSortBy,
    refresh,
    retry,
    deleteTransaction,
    undoDeleteTransaction,
    undoDeleteTransactions,
    updateTransactionCategory,
    updateTransaction,
    createTransaction,
  } = useTransactions();

  // State for transaction detail modal
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // State for category picker modal
  const [categoryPickerTransaction, setCategoryPickerTransaction] =
    useState<Transaction | null>(null);

  // State for create transaction modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // State for undo functionality
  const [undoTransaction, setUndoTransaction] = useState<Transaction | null>(
    null,
  );
  const [undoBulkIds, setUndoBulkIds] = useState<string[]>([]);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State for stats panel
  const [showStats, setShowStats] = useState(false);

  // State for success toast
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for multi-selection mode
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const fabScale = useSharedValue(0);

  // Check if filters are active
  const isFiltered = useMemo(
    () =>
      filters.type !== 'all' ||
      filters.searchQuery.length > 0 ||
      filters.category !== 'all',
    [filters],
  );

  // Optimized key extractor
  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  // Clear undo timeout
  const clearUndoTimeout = useCallback(() => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
  }, []);

  // Handle delete transaction with undo support
  const handleDeleteTransaction = useCallback(
    (transaction: Transaction) => {
      // Clear any existing undo
      clearUndoTimeout();

      // Trigger haptic feedback
      triggerWarning();

      // Close the detail modal if this transaction was selected
      if (selectedTransaction?.id === transaction.id) {
        setSelectedTransaction(null);
      }

      // Store transaction for undo
      setUndoTransaction(transaction);
      setShowUndo(true);

      // Actually delete the transaction (sync - persisted to Redux)
      deleteTransaction(transaction.id);

      // Set timeout to dismiss undo toast
      undoTimeoutRef.current = setTimeout(() => {
        setShowUndo(false);
        setUndoTransaction(null);
      }, UNDO_TIMEOUT);
    },
    [deleteTransaction, clearUndoTimeout, selectedTransaction],
  );

  // Handle undo action - restore the transaction
  const handleUndo = useCallback(() => {
    if (undoTransaction) {
      // Clear the timeout
      clearUndoTimeout();

      // Undo the deletion (persisted)
      if (undoTransaction.id === 'bulk' && undoBulkIds.length > 0) {
        // Bulk undo
        undoDeleteTransactions(undoBulkIds);
        setUndoBulkIds([]);
      } else if (undoTransaction.id !== 'bulk') {
        undoDeleteTransaction(undoTransaction.id);
      }

      // Clear undo state
      setShowUndo(false);
      setUndoTransaction(null);
      triggerSuccess();
    }
  }, [
    undoTransaction,
    undoBulkIds,
    clearUndoTimeout,
    undoDeleteTransaction,
    undoDeleteTransactions,
  ]);

  // Handle dismiss undo toast
  const handleDismissUndo = useCallback(() => {
    clearUndoTimeout();
    setShowUndo(false);
    setUndoTransaction(null);
  }, [clearUndoTimeout]);

  // Handle show stats
  const handleShowStats = useCallback(() => {
    triggerLightImpact();
    setShowStats(true);
  }, []);

  // Handle close stats
  const handleCloseStats = useCallback(() => {
    setShowStats(false);
  }, []);

  // Handle categorize transaction
  const handleCategorizeTransaction = useCallback(
    (transaction: Transaction) => {
      setCategoryPickerTransaction(transaction);
    },
    [],
  );

  // Handle category selection
  const handleCategorySelect = useCallback(
    (transactionId: string, category: string) => {
      updateTransactionCategory(transactionId, category);
      // Update selectedTransaction if it's the one being edited
      if (selectedTransaction?.id === transactionId) {
        setSelectedTransaction(prev => (prev ? { ...prev, category } : null));
      }
    },
    [updateTransactionCategory, selectedTransaction],
  );

  // Handle update transaction from detail modal
  const handleUpdateTransaction = useCallback(
    (transactionId: string, updates: Partial<Transaction>) => {
      updateTransaction(transactionId, updates);
      // Update selectedTransaction to reflect changes immediately
      if (selectedTransaction?.id === transactionId) {
        setSelectedTransaction(prev => (prev ? { ...prev, ...updates } : null));
      }
      triggerSuccess();
      setSuccessMessage('Transaction updated');
    },
    [updateTransaction, selectedTransaction],
  );

  // Handle update category from detail modal
  const handleUpdateCategoryFromModal = useCallback(
    (transactionId: string, category: string) => {
      updateTransactionCategory(transactionId, category);
      // Update selectedTransaction to reflect changes immediately
      if (selectedTransaction?.id === transactionId) {
        setSelectedTransaction(prev => (prev ? { ...prev, category } : null));
      }
      triggerSuccess();
      setSuccessMessage('Category updated');
    },
    [updateTransactionCategory, selectedTransaction],
  );

  // Close category picker
  const handleCloseCategoryPicker = useCallback(() => {
    triggerLightImpact();
    setCategoryPickerTransaction(null);
  }, []);

  // Handle show create modal
  const handleShowCreateModal = useCallback(() => {
    triggerLightImpact();
    setShowCreateModal(true);
  }, []);

  // Handle close create modal
  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  // Handle create transaction
  const handleCreateTransaction = useCallback(
    async (transaction: Omit<Transaction, 'id'>) => {
      await createTransaction(transaction);
      triggerSuccess();
      setSuccessMessage('Transaction created successfully');
    },
    [createTransaction],
  );

  // Handle long press to enter selection mode
  const handleLongPress = useCallback(
    (transaction: Transaction) => {
      if (!isSelectionMode) {
        triggerMediumImpact();
        setIsSelectionMode(true);
        setSelectedIds(new Set([transaction.id]));
        fabScale.value = withSpring(1, { damping: 12, stiffness: 150 });
      }
    },
    [isSelectionMode, fabScale],
  );

  // Handle toggle selection
  const handleToggleSelection = useCallback(
    (transaction: Transaction) => {
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(transaction.id)) {
          newSet.delete(transaction.id);
        } else {
          newSet.add(transaction.id);
        }
        // Exit selection mode if no items selected
        if (newSet.size === 0) {
          setIsSelectionMode(false);
          fabScale.value = withTiming(0, { duration: 200 });
        }
        return newSet;
      });
    },
    [fabScale],
  );

  // Handle cancel selection mode
  const handleCancelSelection = useCallback(() => {
    triggerLightImpact();
    setIsSelectionMode(false);
    setSelectedIds(new Set());
    fabScale.value = withTiming(0, { duration: 200 });
  }, [fabScale]);

  // Handle select all transactions
  const handleSelectAll = useCallback(() => {
    triggerSelection();
    const allIds = new Set(transactions.map(t => t.id));
    setSelectedIds(allIds);
  }, [transactions]);

  // Check if all transactions are selected
  const isAllSelected = useMemo(() => {
    return transactions.length > 0 && selectedIds.size === transactions.length;
  }, [transactions.length, selectedIds.size]);

  // Handle delete selected transactions
  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;

    // Clear any existing undo
    clearUndoTimeout();

    triggerWarning();

    const count = selectedIds.size;
    const idsToDelete = Array.from(selectedIds);

    // Store IDs for undo
    setUndoBulkIds(idsToDelete);

    // Delete all selected transactions (sync)
    idsToDelete.forEach(id => deleteTransaction(id));

    // Exit selection mode
    setIsSelectionMode(false);
    setSelectedIds(new Set());
    fabScale.value = withTiming(0, { duration: 200 });

    // Show undo toast
    setUndoTransaction({
      id: 'bulk',
      merchant: `${count} transactions`,
      amount: 0,
      type: 'expense',
      category: '',
      date: '',
    } as Transaction);
    setShowUndo(true);

    // Set timeout to dismiss undo toast
    undoTimeoutRef.current = setTimeout(() => {
      setShowUndo(false);
      setUndoTransaction(null);
      setUndoBulkIds([]);
    }, UNDO_TIMEOUT);
  }, [selectedIds, deleteTransaction, fabScale, clearUndoTimeout]);

  // Animated style for FAB
  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: fabScale.value },
        {
          translateY: interpolate(
            fabScale.value,
            [0, 1],
            [50, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
      opacity: fabScale.value,
    };
  });

  // Memoized render item
  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<Transaction, DateSection>) => (
      <SwipeableTransactionItem
        transaction={item}
        onPress={() => setSelectedTransaction(item)}
        onDelete={handleDeleteTransaction}
        onCategorize={handleCategorizeTransaction}
        onLongPress={handleLongPress}
        isSelectionMode={isSelectionMode}
        isSelected={selectedIds.has(item.id)}
        onToggleSelection={handleToggleSelection}
      />
    ),
    [
      handleDeleteTransaction,
      handleCategorizeTransaction,
      handleLongPress,
      isSelectionMode,
      selectedIds,
      handleToggleSelection,
    ],
  );

  // Render section header
  const renderSectionHeader = useCallback(
    ({ section }: { section: DateSection }) => (
      <SectionHeader title={section.title} count={section.data.length} />
    ),
    [],
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (filter: FilterButtonType) => {
      setTypeFilter(filter);
    },
    [setTypeFilter],
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (sort: SortOption) => {
      setSortBy(sort);
    },
    [setSortBy],
  );

  // Handle category change
  const handleCategoryChange = useCallback(
    (category: CategoryFilter) => {
      setCategoryFilter(category);
    },
    [setCategoryFilter],
  );

  // Handle modal close
  const handleModalClose = useCallback(() => {
    triggerLightImpact();
    setSelectedTransaction(null);
  }, []);

  // Handle refresh with haptic feedback
  const handleRefresh = useCallback(() => {
    triggerSuccess();
    refresh();
  }, [refresh]);

  // Render list header (balance + search + filters + sort)
  const ListHeader = useMemo(
    () => (
      <View>
        {/* Balance Summary - shows net balance at the top */}
        {!isLoading && transactions.length > 0 && (
          <BalanceSummary
            transactions={transactions}
            onPress={handleShowStats}
          />
        )}
        <SearchBar value={filters.searchQuery} onChangeText={setSearchQuery} />
        <FilterBar
          activeFilter={filters.type}
          onFilterChange={handleFilterChange}
        />
        <CategoryFilterBar
          categories={categories}
          activeCategory={filters.category || 'all'}
          onCategoryChange={handleCategoryChange}
        />
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
            {isLoading
              ? 'Loading transactions...'
              : `${transactions.length} transaction${
                  transactions.length !== 1 ? 's' : ''
                }`}
          </Text>
          <SortBar
            activeSort={filters.sortBy || 'date_desc'}
            onSortChange={handleSortChange}
          />
        </View>
      </View>
    ),
    [
      filters.searchQuery,
      filters.type,
      filters.category,
      filters.sortBy,
      categories,
      setSearchQuery,
      handleFilterChange,
      handleCategoryChange,
      handleSortChange,
      handleShowStats,
      isLoading,
      transactions.length,
      transactions,
      colors.textSecondary,
    ],
  );

  // Render empty list component
  const renderEmptyComponent = useCallback(() => {
    if (isLoading) {
      return null;
    }
    return (
      <EmptyState
        isFiltered={isFiltered}
        title={isFiltered ? 'No matching transactions' : 'No transactions yet'}
        message={
          isFiltered
            ? 'Try adjusting your filters or search terms.'
            : 'Your transactions will appear here once you make some purchases.'
        }
      />
    );
  }, [isLoading, isFiltered]);

  // Show error state
  if (error && !isRefreshing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView
          edges={['top']}
          style={{ backgroundColor: colors.background }}
        >
          <View
            style={[
              styles.header,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <View style={styles.headerTitleContainer}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Transactions
              </Text>
              <Text
                style={[styles.headerSubtitle, { color: colors.textSecondary }]}
              >
                Your financial activity
              </Text>
            </View>
            <View style={styles.headerActions}>
              <ThemeToggle />
            </View>
          </View>
        </SafeAreaView>
        <ErrorState message={error} onRetry={retry} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with SafeArea */}
      <SafeAreaView
        edges={['top']}
        style={{ backgroundColor: colors.background }}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          {isSelectionMode ? (
            <>
              <Pressable
                style={styles.cancelButton}
                onPress={handleCancelSelection}
                accessibilityRole="button"
                accessibilityLabel="Cancel selection"
              >
                <CloseIcon size={20} color={colors.textPrimary} />
              </Pressable>
              <Text
                style={[styles.selectionTitle, { color: colors.textPrimary }]}
              >
                {selectedIds.size} selected
              </Text>
            </>
          ) : (
            <View style={styles.headerTitleContainer}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Transactions
              </Text>
              <Text
                style={[styles.headerSubtitle, { color: colors.textSecondary }]}
              >
                Your financial activity
              </Text>
            </View>
          )}
          <View style={styles.headerActions}>
            {isSelectionMode ? (
              <Pressable
                style={[
                  styles.selectAllButton,
                  {
                    backgroundColor: isAllSelected
                      ? colors.primary
                      : colors.primaryLight,
                  },
                ]}
                onPress={handleSelectAll}
                accessibilityRole="button"
                accessibilityLabel="Select all transactions"
                disabled={isAllSelected}
              >
                <Text
                  style={[
                    styles.selectAllText,
                    { color: isAllSelected ? colors.surface : colors.primary },
                  ]}
                >
                  {isAllSelected ? 'All Selected' : 'Select All'}
                </Text>
              </Pressable>
            ) : (
              <ThemeToggle />
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Show skeleton while loading initially */}
      {isLoading && !isRefreshing ? (
        <View>
          {ListHeader}
          <TransactionSkeleton count={6} />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={renderEmptyComponent}
          stickySectionHeadersEnabled={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            sections.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          // Performance optimizations
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={21}
          initialNumToRender={10}
        />
      )}

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        visible={selectedTransaction !== null}
        onClose={handleModalClose}
        onDelete={handleDeleteTransaction}
        onUpdateCategory={handleUpdateCategoryFromModal}
        onUpdateTransaction={handleUpdateTransaction}
      />

      {/* Category Picker Modal */}
      <CategoryPickerModal
        transaction={categoryPickerTransaction}
        visible={categoryPickerTransaction !== null}
        onClose={handleCloseCategoryPicker}
        onSelectCategory={handleCategorySelect}
      />

      {/* Stats Panel */}
      <StatsPanel
        visible={showStats}
        onClose={handleCloseStats}
        transactions={transactions}
      />

      {/* Undo Toast */}
      <UndoToast
        visible={showUndo}
        message={
          undoTransaction
            ? `Deleted "${undoTransaction.merchant}"`
            : 'Transaction deleted'
        }
        onUndo={handleUndo}
        onDismiss={handleDismissUndo}
      />

      {/* Success Toast */}
      <SuccessToast
        visible={!!successMessage}
        message={successMessage || ''}
        onDismiss={() => setSuccessMessage(null)}
      />

      {/* Floating Delete Button for Selection Mode */}
      <Animated.View
        style={[
          styles.fab,
          { bottom: insets.bottom + spacing.lg },
          fabAnimatedStyle,
        ]}
      >
        <Pressable
          style={[styles.fabButton, { backgroundColor: colors.expense }]}
          onPress={handleDeleteSelected}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${selectedIds.size} selected transactions`}
        >
          <DeleteIcon size={24} color="#FFFFFF" />
        </Pressable>
      </Animated.View>

      {/* Floating Create Button (hidden in selection mode and when undo is showing) */}
      {!isSelectionMode && !showUndo && (
        <View
          style={[styles.fabCreate, { bottom: insets.bottom + spacing.lg }]}
        >
          <Pressable
            style={[styles.fabButton, { backgroundColor: colors.primary }]}
            onPress={handleShowCreateModal}
            accessibilityRole="button"
            accessibilityLabel="Create new transaction"
          >
            <PlusIcon size={28} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      {/* Create Transaction Modal */}
      <CreateTransactionModal
        visible={showCreateModal}
        onClose={handleCloseCreateModal}
        onCreateTransaction={handleCreateTransaction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
  },
  headerSubtitle: {
    fontSize: typography.size.md,
    marginTop: spacing.xs,
  },
  selectionTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    flex: 1,
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selectAllButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  selectAllText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  resultsText: {
    fontSize: typography.size.sm,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    left: spacing.lg,
    bottom: spacing.xxl,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  fabCreate: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xxl,
  },
});
