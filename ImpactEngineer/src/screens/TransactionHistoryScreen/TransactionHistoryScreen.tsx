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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CategoryFilterBar,
  EmptyState,
  ErrorState,
  FilterBar,
  SearchBar,
  SectionHeader,
  SortBar,
  TransactionDetailModal,
  TransactionItem,
  TransactionSkeleton,
  TRANSACTION_ITEM_HEIGHT,
} from '../../components';
import { useTransactionsRedux as useTransactions } from '../../hooks';
import { colors, spacing, typography } from '../../theme';
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
  } = useTransactions();

  // State for transaction detail modal
  const [selectedTransaction, setSelectedTransaction] =
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

  // Memoized render item
  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<Transaction, DateSection>) => (
      <TransactionItem
        transaction={item}
        onPress={() => setSelectedTransaction(item)}
      />
    ),
    [],
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
    setSelectedTransaction(null);
  }, []);

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
              onRefresh={refresh}
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
