/**
 * TransactionHistoryScreen
 * Main screen displaying the user's transaction history with filtering capabilities
 */

import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ListRenderItemInfo,
} from 'react-native';
import {
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import {
  EmptyState,
  ErrorState,
  FilterBar,
  SearchBar,
  TransactionItem,
  TransactionSkeleton,
  TRANSACTION_ITEM_HEIGHT,
} from '../../components';
import { useTransactions } from '../../hooks';
import { colors, spacing, typography } from '../../theme';
import { Transaction, FilterButtonType } from '../../types';

// Separator height for getItemLayout calculation
const SEPARATOR_HEIGHT = 0;
const ITEM_HEIGHT = TRANSACTION_ITEM_HEIGHT + spacing.xs * 2;

export function TransactionHistoryScreen() {
  const insets = useSafeAreaInsets();
  const {
    transactions,
    isLoading,
    isRefreshing,
    error,
    filters,
    setTypeFilter,
    setSearchQuery,
    refresh,
    retry,
  } = useTransactions();

  // Check if filters are active
  const isFiltered = useMemo(
    () => filters.type !== 'all' || filters.searchQuery.length > 0,
    [filters],
  );

  // Optimized key extractor
  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  // Optimized getItemLayout for fixed height items
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  // Memoized render item
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Transaction>) => (
      <TransactionItem transaction={item} />
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

  // Render list header (search + filters)
  const ListHeader = useMemo(
    () => (
      <View>
        <SearchBar value={filters.searchQuery} onChangeText={setSearchQuery} />
        <FilterBar
          activeFilter={filters.type}
          onFilterChange={handleFilterChange}
        />
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {isLoading
              ? 'Loading transactions...'
              : `${transactions.length} transaction${
                  transactions.length !== 1 ? 's' : ''
                }`}
          </Text>
        </View>
      </View>
    ),
    [
      filters.searchQuery,
      filters.type,
      setSearchQuery,
      handleFilterChange,
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
        <FlatList
          data={transactions}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={renderEmptyComponent}
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
            transactions.length === 0 && styles.emptyListContent,
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
