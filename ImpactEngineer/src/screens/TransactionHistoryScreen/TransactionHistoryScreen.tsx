/**
 * TransactionHistoryScreen
 * Main screen displaying the user's transaction history with filtering capabilities
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  SectionList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  SectionListRenderItemInfo,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CategoryFilterBar,
  CategoryPickerModal,
  EmptyState,
  ErrorState,
  FilterBar,
  SearchBar,
  SectionHeader,
  SortBar,
  SwipeableTransactionItem,
  TransactionDetailModal,
  TransactionSkeleton,
  TRANSACTION_ITEM_HEIGHT,
} from '../../components';
import { useTransactionsRedux as useTransactions } from '../../hooks';
import { colors, spacing, typography } from '../../theme';
import {
  triggerSuccess,
  triggerLightImpact,
  triggerWarning,
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

export function TransactionHistoryScreen() {
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
    updateTransactionCategory,
  } = useTransactions();

  // State for transaction detail modal
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // State for category picker modal
  const [categoryPickerTransaction, setCategoryPickerTransaction] =
    useState<Transaction | null>(null);

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

  // Handle delete transaction
  const handleDeleteTransaction = useCallback(
    (transaction: Transaction) => {
      Alert.alert(
        'Delete Transaction',
        `Are you sure you want to delete the transaction from ${transaction.merchant}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              triggerWarning();
              await deleteTransaction(transaction.id);
            },
          },
        ],
      );
    },
    [deleteTransaction],
  );

  // Handle categorize transaction
  const handleCategorizeTransaction = useCallback(
    (transaction: Transaction) => {
      setCategoryPickerTransaction(transaction);
    },
    [],
  );

  // Handle category selection
  const handleCategorySelect = useCallback(
    async (transactionId: string, category: string) => {
      await updateTransactionCategory(transactionId, category);
    },
    [updateTransactionCategory],
  );

  // Close category picker
  const handleCloseCategoryPicker = useCallback(() => {
    triggerLightImpact();
    setCategoryPickerTransaction(null);
  }, []);

  // Memoized render item
  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<Transaction, DateSection>) => (
      <SwipeableTransactionItem
        transaction={item}
        onPress={() => setSelectedTransaction(item)}
        onDelete={handleDeleteTransaction}
        onCategorize={handleCategorizeTransaction}
      />
    ),
    [handleDeleteTransaction, handleCategorizeTransaction],
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

  // Render list header (search + filters + sort)
  const ListHeader = useMemo(
    () => (
      <View>
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
          <Text style={styles.resultsText}>
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
      isLoading,
      transactions.length,
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
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.title}>Transactions</Text>
          </View>
        </SafeAreaView>
        <ErrorState message={error} onRetry={retry} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with white SafeArea */}
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
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
      />

      {/* Category Picker Modal */}
      <CategoryPickerModal
        transaction={categoryPickerTransaction}
        visible={categoryPickerTransaction !== null}
        onClose={handleCloseCategoryPicker}
        onSelectCategory={handleCategorySelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
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
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  emptyListContent: {
    flexGrow: 1,
  },
});
