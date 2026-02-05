/**
 * AnalyticsScreen
 * Comprehensive financial analytics with charts and insights
 * OPTIMIZED VERSION - Better performance with memoization
 */

import React, { useMemo, useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useThemeColors,
  spacing,
  borderRadius,
  typography,
  shadows,
  ThemeColors,
} from '../../theme';
import { useTransactionsRedux } from '../../hooks';
import { formatCurrency } from '../../utils/currency';
import { getCategoryIcon } from '../../components/Icons/CategoryIcons';
import {
  TrendUpIcon,
  TrendDownIcon,
} from '../../components/Icons/NavigationIcons';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';

// Time frame options
type TimeFrame = 'today' | 'week' | 'month' | 'year' | 'all';

const timeFrameOptions: { key: TimeFrame; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: '7 Days' },
  { key: 'month', label: '30 Days' },
  { key: 'year', label: 'Year' },
  { key: 'all', label: 'All' },
];

// Category colors for charts
const CATEGORY_COLORS: Record<string, string> = {
  'Food & Drink': '#F59E0B',
  Groceries: '#10B981',
  Shopping: '#EC4899',
  Transportation: '#3B82F6',
  Entertainment: '#8B5CF6',
  Bills: '#EF4444',
  Health: '#14B8A6',
  Income: '#10B981',
  Investments: '#6366F1',
  Travel: '#F97316',
  Electronics: '#64748B',
  Other: '#94A3B8',
};

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
}

// ============ MEMOIZED SUB-COMPONENTS ============

// Category Bar Component - memoized to prevent re-renders
interface CategoryBarProps {
  item: CategoryData;
  maxAmount: number;
  isSelected: boolean;
  onPress: (category: string) => void;
  colors: ThemeColors;
}

const CategoryBar = memo<CategoryBarProps>(
  ({ item, maxAmount, isSelected: _isSelected, onPress, colors }) => {
    const barWidth = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
    const CategoryIcon = getCategoryIcon(item.category);

    const handlePress = useCallback(() => {
      onPress(item.category);
    }, [item.category, onPress]);

    return (
      <TouchableOpacity
        style={styles.categoryBarContainer}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.categoryBarHeader}>
          <View style={styles.categoryInfo}>
            <View
              style={[
                styles.categoryIconBg,
                { backgroundColor: item.color + '20' },
              ]}
            >
              <CategoryIcon size={16} color={item.color} />
            </View>
            <View style={styles.categoryTextContainer}>
              <Text
                style={[styles.categoryName, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                {item.category}
              </Text>
              <Text style={[styles.categoryCount, { color: colors.textHint }]}>
                {item.count} transaction{item.count !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <View style={styles.categoryAmountContainer}>
            <Text
              style={[styles.categoryAmount, { color: colors.textPrimary }]}
            >
              {formatCurrency(item.amount)}
            </Text>
            <Text
              style={[
                styles.categoryPercentage,
                { color: colors.textSecondary },
              ]}
            >
              {item.percentage.toFixed(1)}%
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.barBackground,
            { backgroundColor: colors.surfaceSecondary },
          ]}
        >
          <View
            style={[
              styles.barFill,
              {
                width: `${barWidth}%`,
                backgroundColor: item.color,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  },
);

// Income vs Expense Comparison Bar
interface ComparisonBarProps {
  income: number;
  expenses: number;
  colors: ThemeColors;
}

const IncomeExpenseComparison = memo<ComparisonBarProps>(
  ({ income, expenses, colors }) => {
    const total = income + expenses;
    const incomePercent = total > 0 ? (income / total) * 100 : 50;
    const expensePercent = total > 0 ? (expenses / total) * 100 : 50;
    const spentPercent =
      income > 0 ? Math.min((expenses / income) * 100, 100) : 0;
    const savedPercent = income > 0 ? Math.max(100 - spentPercent, 0) : 0;
    const isOverBudget = expenses > income;

    return (
      <View style={styles.comparisonContainer}>
        {/* Visual Comparison Bars */}
        <View style={styles.comparisonBars}>
          {/* Income Bar */}
          <View style={styles.comparisonBarRow}>
            <View style={styles.comparisonLabelContainer}>
              <TrendUpIcon size={16} color={colors.income} />
              <Text
                style={[
                  styles.comparisonLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Income
              </Text>
            </View>
            <View
              style={[
                styles.comparisonBarBg,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <View
                style={[
                  styles.comparisonBarFill,
                  {
                    width: `${incomePercent}%`,
                    backgroundColor: colors.income,
                  },
                ]}
              />
            </View>
            <Text style={[styles.comparisonValue, { color: colors.income }]}>
              {formatCurrency(income)}
            </Text>
          </View>

          {/* Expense Bar */}
          <View style={styles.comparisonBarRow}>
            <View style={styles.comparisonLabelContainer}>
              <TrendDownIcon size={16} color={colors.expense} />
              <Text
                style={[
                  styles.comparisonLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Expenses
              </Text>
            </View>
            <View
              style={[
                styles.comparisonBarBg,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <View
                style={[
                  styles.comparisonBarFill,
                  {
                    width: `${expensePercent}%`,
                    backgroundColor: colors.expense,
                  },
                ]}
              />
            </View>
            <Text style={[styles.comparisonValue, { color: colors.expense }]}>
              {formatCurrency(expenses)}
            </Text>
          </View>
        </View>

        {/* Budget Progress */}
        <View style={styles.budgetProgress}>
          <View style={styles.budgetHeader}>
            <Text style={[styles.budgetTitle, { color: colors.textPrimary }]}>
              Budget Usage
            </Text>
            <Text
              style={[
                styles.budgetPercent,
                { color: isOverBudget ? colors.expense : colors.income },
              ]}
            >
              {spentPercent.toFixed(0)}% spent
            </Text>
          </View>
          <View
            style={[
              styles.budgetBarBg,
              { backgroundColor: colors.surfaceSecondary },
            ]}
          >
            <View
              style={[
                styles.budgetBarFill,
                {
                  width: `${Math.min(spentPercent, 100)}%`,
                  backgroundColor: isOverBudget
                    ? colors.expense
                    : colors.income,
                },
              ]}
            />
            {!isOverBudget && savedPercent > 0 && (
              <View
                style={[
                  styles.budgetBarSaved,
                  {
                    width: `${savedPercent}%`,
                    backgroundColor: colors.income + '40',
                  },
                ]}
              />
            )}
          </View>
          <View style={styles.budgetLegend}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  {
                    backgroundColor: isOverBudget
                      ? colors.expense
                      : colors.income,
                  },
                ]}
              />
              <Text
                style={[styles.legendText, { color: colors.textSecondary }]}
              >
                Spent: {formatCurrency(expenses)}
              </Text>
            </View>
            {!isOverBudget && (
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: colors.income + '40' },
                  ]}
                />
                <Text
                  style={[styles.legendText, { color: colors.textSecondary }]}
                >
                  Remaining: {formatCurrency(income - expenses)}
                </Text>
              </View>
            )}
            {isOverBudget && (
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: colors.expense },
                  ]}
                />
                <Text style={[styles.legendText, { color: colors.expense }]}>
                  Over by: {formatCurrency(expenses - income)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  },
);

// Top Expense Item Component - memoized
interface TopExpenseItemProps {
  expense: {
    id: string;
    merchant: string;
    amount: number;
    category: string;
  };
  index: number;
  colors: ThemeColors;
}

const TopExpenseItem = memo<TopExpenseItemProps>(
  ({ expense, index, colors }) => {
    const CategoryIcon = getCategoryIcon(expense.category);
    const categoryColor =
      CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;

    return (
      <View
        style={[
          styles.topExpenseItem,
          { borderBottomColor: colors.borderLight },
        ]}
      >
        <View
          style={[
            styles.topExpenseRank,
            { backgroundColor: colors.surfaceSecondary },
          ]}
        >
          <Text style={[styles.rankNumber, { color: colors.textSecondary }]}>
            {index + 1}
          </Text>
        </View>
        <View
          style={[
            styles.topExpenseIcon,
            { backgroundColor: categoryColor + '20' },
          ]}
        >
          <CategoryIcon size={16} color={categoryColor} />
        </View>
        <View style={styles.topExpenseDetails}>
          <Text
            style={[styles.topExpenseMerchant, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {expense.merchant}
          </Text>
          <Text
            style={[styles.topExpenseCategory, { color: colors.textSecondary }]}
          >
            {expense.category}
          </Text>
        </View>
        <Text style={[styles.topExpenseAmount, { color: colors.expense }]}>
          {formatCurrency(Math.abs(expense.amount))}
        </Text>
      </View>
    );
  },
);

// Quick Stat Item - memoized
interface QuickStatItemProps {
  value: string | number;
  label: string;
  colors: ThemeColors;
}

const QuickStatItem = memo<QuickStatItemProps>(({ value, label, colors }) => (
  <View
    style={[styles.quickStatItem, { backgroundColor: colors.surfaceSecondary }]}
  >
    <Text style={[styles.quickStatValue, { color: colors.textPrimary }]}>
      {value}
    </Text>
    <Text style={[styles.quickStatLabel, { color: colors.textSecondary }]}>
      {label}
    </Text>
  </View>
));

// ============ MAIN COMPONENT ============

export const AnalyticsScreen: React.FC = () => {
  const colors = useThemeColors();
  const { allTransactions, refresh } = useTransactionsRedux();
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<TimeFrame>('month');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categoryViewType, setCategoryViewType] = useState<
    'expense' | 'income'
  >('expense');

  // Pull to refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [refresh]);

  // Filter transactions by time frame
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      const transactionDay = new Date(
        transactionDate.getFullYear(),
        transactionDate.getMonth(),
        transactionDate.getDate(),
      );

      switch (selectedTimeFrame) {
        case 'today': {
          return transactionDay.getTime() === today.getTime();
        }
        case 'week': {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return transactionDate >= weekAgo;
        }
        case 'month': {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return transactionDate >= monthAgo;
        }
        case 'year': {
          const yearAgo = new Date(today);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          return transactionDate >= yearAgo;
        }
        case 'all':
        default:
          return true;
      }
    });
  }, [allTransactions, selectedTimeFrame]);

  // Calculate totals
  const totals = useMemo(() => {
    let income = 0;
    let expenses = 0;

    for (const t of filteredTransactions) {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expenses += Math.abs(t.amount);
      }
    }

    const net = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    return { income, expenses, net, savingsRate };
  }, [filteredTransactions]);

  // Category breakdown for expenses
  const expenseCategoryBreakdown = useMemo((): CategoryData[] => {
    const categoryMap = new Map<string, { amount: number; count: number }>();

    for (const t of filteredTransactions) {
      if (t.type === 'expense') {
        const existing = categoryMap.get(t.category) || { amount: 0, count: 0 };
        categoryMap.set(t.category, {
          amount: existing.amount + Math.abs(t.amount),
          count: existing.count + 1,
        });
      }
    }

    const totalExpenses = totals.expenses;

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        count: data.count,
        color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions, totals.expenses]);

  // Category breakdown for income
  const incomeCategoryBreakdown = useMemo((): CategoryData[] => {
    const categoryMap = new Map<string, { amount: number; count: number }>();

    for (const t of filteredTransactions) {
      if (t.type === 'income') {
        const existing = categoryMap.get(t.category) || { amount: 0, count: 0 };
        categoryMap.set(t.category, {
          amount: existing.amount + t.amount,
          count: existing.count + 1,
        });
      }
    }

    const totalIncome = totals.income;

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: totalIncome > 0 ? (data.amount / totalIncome) * 100 : 0,
        count: data.count,
        color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions, totals.income]);

  // Active category breakdown based on toggle
  const categoryBreakdown =
    categoryViewType === 'expense'
      ? expenseCategoryBreakdown
      : incomeCategoryBreakdown;

  // Count active days for quick stats
  const activeDaysCount = useMemo(() => {
    const daySet = new Set<string>();
    for (const t of filteredTransactions) {
      daySet.add(t.date.split('T')[0]);
    }
    return daySet.size;
  }, [filteredTransactions]);

  // Top transactions
  const topExpenses = useMemo(() => {
    return [...filteredTransactions]
      .filter(t => t.type === 'expense')
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 5);
  }, [filteredTransactions]);

  // Max category amount for bar width calculation
  const maxCategoryAmount = useMemo(() => {
    return categoryBreakdown[0]?.amount || 1;
  }, [categoryBreakdown]);

  // Quick stats values - memoized
  const quickStats = useMemo(() => {
    const expenseCount = filteredTransactions.filter(
      t => t.type === 'expense',
    ).length;
    return {
      totalTransactions: filteredTransactions.length,
      categoryCount: categoryBreakdown.length,
      activeDays: activeDaysCount,
      avgTransaction: formatCurrency(totals.expenses / (expenseCount || 1)),
    };
  }, [
    filteredTransactions,
    categoryBreakdown.length,
    activeDaysCount,
    totals.expenses,
  ]);

  const handleTimeFrameChange = useCallback((timeFrame: TimeFrame) => {
    setSelectedTimeFrame(timeFrame);
    setSelectedCategory(null);
  }, []);

  const handleCategoryPress = useCallback((category: string) => {
    setSelectedCategory(prev => (prev === category ? null : category));
  }, []);

  const handleCategoryViewToggle = useCallback(() => {
    setCategoryViewType(prev => (prev === 'expense' ? 'income' : 'expense'));
    setSelectedCategory(null);
  }, []);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(
    () => ({
      container: [styles.container, { backgroundColor: colors.background }],
      headerTitle: [styles.headerTitle, { color: colors.textPrimary }],
      headerSubtitle: [styles.headerSubtitle, { color: colors.textSecondary }],
      timeFrameContainer: [
        styles.timeFrameContainer,
        { backgroundColor: colors.surface },
      ],
      summaryCard: [styles.summaryCard, { backgroundColor: colors.surface }],
      netBalanceCard: [
        styles.netBalanceCard,
        { backgroundColor: colors.surface },
      ],
      sectionCard: [styles.sectionCard, { backgroundColor: colors.surface }],
      sectionTitle: [styles.sectionTitle, { color: colors.textPrimary }],
      sectionTitleNoMargin: [
        styles.sectionTitleNoMargin,
        { color: colors.textPrimary },
      ],
    }),
    [colors],
  );

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={dynamicStyles.headerTitle}>Analytics</Text>
            <Text style={dynamicStyles.headerSubtitle}>
              Track your financial health
            </Text>
          </View>
          <ThemeToggle />
        </View>

        {/* Time Frame Selector */}
        <View style={dynamicStyles.timeFrameContainer}>
          {timeFrameOptions.map(option => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.timeFrameButton,
                selectedTimeFrame === option.key && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => handleTimeFrameChange(option.key)}
            >
              <Text
                style={[
                  styles.timeFrameText,
                  { color: colors.textSecondary },
                  selectedTimeFrame === option.key &&
                    styles.timeFrameTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          {/* Income Card */}
          <View style={[dynamicStyles.summaryCard, styles.incomeCard]}>
            <View style={styles.cardHeader}>
              <TrendUpIcon size={20} color={colors.income} />
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
                Income
              </Text>
            </View>
            <Text style={[styles.cardAmount, { color: colors.income }]}>
              {formatCurrency(totals.income)}
            </Text>
          </View>

          {/* Expenses Card */}
          <View style={[dynamicStyles.summaryCard, styles.expenseCard]}>
            <View style={styles.cardHeader}>
              <TrendDownIcon size={20} color={colors.expense} />
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
                Expenses
              </Text>
            </View>
            <Text style={[styles.cardAmount, { color: colors.expense }]}>
              {formatCurrency(totals.expenses)}
            </Text>
          </View>
        </View>

        {/* Net Balance Card */}
        <View style={dynamicStyles.netBalanceCard}>
          <View style={styles.netBalanceRow}>
            <View>
              <Text
                style={[
                  styles.netBalanceLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Net Balance
              </Text>
              <Text
                style={[
                  styles.netBalanceAmount,
                  { color: totals.net >= 0 ? colors.income : colors.expense },
                ]}
              >
                {totals.net >= 0 ? '+' : ''}
                {formatCurrency(Math.abs(totals.net))}
              </Text>
            </View>
            <View style={styles.savingsRateContainer}>
              <Text
                style={[
                  styles.savingsRateLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Savings Rate
              </Text>
              <Text
                style={[
                  styles.savingsRateValue,
                  {
                    color:
                      totals.savingsRate >= 20
                        ? colors.income
                        : totals.savingsRate >= 0
                        ? colors.textSecondary
                        : colors.expense,
                  },
                ]}
              >
                {totals.savingsRate.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Income vs Expenses Comparison */}
        <View style={dynamicStyles.sectionCard}>
          <Text style={dynamicStyles.sectionTitle}>Income vs Expenses</Text>
          <IncomeExpenseComparison
            income={totals.income}
            expenses={totals.expenses}
            colors={colors}
          />
        </View>

        {/* Category Breakdown */}
        <View style={dynamicStyles.sectionCard}>
          <View style={styles.categoryHeader}>
            <Text style={dynamicStyles.sectionTitleNoMargin}>
              {categoryViewType === 'expense' ? 'Spending' : 'Income'} by
              Category
            </Text>
            <TouchableOpacity
              style={[
                styles.categoryToggle,
                { backgroundColor: colors.surfaceSecondary },
              ]}
              onPress={handleCategoryViewToggle}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.toggleOption,
                  categoryViewType === 'expense' && {
                    backgroundColor: colors.expense,
                  },
                ]}
              >
                <TrendDownIcon
                  size={14}
                  color={
                    categoryViewType === 'expense'
                      ? '#FFFFFF'
                      : colors.textSecondary
                  }
                />
              </View>
              <View
                style={[
                  styles.toggleOption,
                  categoryViewType === 'income' && {
                    backgroundColor: colors.income,
                  },
                ]}
              >
                <TrendUpIcon
                  size={14}
                  color={
                    categoryViewType === 'income'
                      ? '#FFFFFF'
                      : colors.textSecondary
                  }
                />
              </View>
            </TouchableOpacity>
          </View>
          {categoryBreakdown.length > 0 ? (
            <View style={styles.categoryList}>
              {categoryBreakdown.map(item => (
                <CategoryBar
                  key={item.category}
                  item={item}
                  maxAmount={maxCategoryAmount}
                  isSelected={selectedCategory === item.category}
                  onPress={handleCategoryPress}
                  colors={colors}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No {categoryViewType} data for this period
              </Text>
            </View>
          )}
        </View>

        {/* Top Expenses */}
        <View style={dynamicStyles.sectionCard}>
          <Text style={dynamicStyles.sectionTitle}>Top Expenses</Text>
          {topExpenses.length > 0 ? (
            <View style={styles.topExpensesList}>
              {topExpenses.map((expense, index) => (
                <TopExpenseItem
                  key={expense.id}
                  expense={expense}
                  index={index}
                  colors={colors}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No expenses for this period
              </Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={dynamicStyles.sectionCard}>
          <Text style={dynamicStyles.sectionTitle}>Quick Stats</Text>
          <View style={styles.quickStatsGrid}>
            <QuickStatItem
              value={quickStats.totalTransactions}
              label="Transactions"
              colors={colors}
            />
            <QuickStatItem
              value={quickStats.categoryCount}
              label="Categories"
              colors={colors}
            />
            <QuickStatItem
              value={quickStats.activeDays}
              label="Active Days"
              colors={colors}
            />
            <QuickStatItem
              value={quickStats.avgTransaction}
              label="Avg Transaction"
              colors={colors}
            />
          </View>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ STATIC STYLES (created once) ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
  },
  headerSubtitle: {
    fontSize: typography.size.md,
    marginTop: spacing.xs,
  },
  timeFrameContainer: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  timeFrameText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  timeFrameTextActive: {
    color: '#FFFFFF',
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  incomeCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  expenseCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardLabel: {
    fontSize: typography.size.sm,
  },
  cardAmount: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  netBalanceCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  netBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netBalanceLabel: {
    fontSize: typography.size.sm,
    marginBottom: spacing.xs,
  },
  netBalanceAmount: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
  },
  savingsRateContainer: {
    alignItems: 'flex-end',
  },
  savingsRateLabel: {
    fontSize: typography.size.sm,
    marginBottom: spacing.xs,
  },
  savingsRateValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  sectionCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.md,
  },
  sectionTitleNoMargin: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  averageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  averageLabel: {
    fontSize: typography.size.sm,
  },
  averageValue: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  spendingBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  barWrapper: {
    height: 60,
    justifyContent: 'flex-end',
    marginBottom: spacing.xs,
  },
  miniBar: {
    width: 20,
    borderRadius: borderRadius.sm,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 9,
    textAlign: 'center',
  },
  barTooltip: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    minWidth: 80,
    alignItems: 'center',
    zIndex: 100,
    ...shadows.md,
  },
  tooltipDate: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    marginBottom: 2,
  },
  tooltipAmount: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  tooltipIncome: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  emptyBars: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barsInfo: {
    fontSize: typography.size.xs,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryToggle: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 3,
    gap: 2,
  },
  toggleOption: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryList: {
    gap: spacing.md,
  },
  categoryBarContainer: {
    marginBottom: spacing.sm,
  },
  categoryBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconBg: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  categoryCount: {
    fontSize: typography.size.xs,
  },
  categoryAmountContainer: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  categoryPercentage: {
    fontSize: typography.size.xs,
  },
  barBackground: {
    height: 6,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  topExpensesList: {
    gap: spacing.sm,
  },
  topExpenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  topExpenseRank: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rankNumber: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
  topExpenseIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  topExpenseDetails: {
    flex: 1,
  },
  topExpenseMerchant: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  topExpenseCategory: {
    fontSize: typography.size.xs,
  },
  topExpenseAmount: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickStatItem: {
    flex: 1,
    minWidth: '45%',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },
  quickStatLabel: {
    fontSize: typography.size.xs,
    textAlign: 'center',
  },
  // Income vs Expenses Comparison styles
  comparisonContainer: {
    gap: spacing.lg,
  },
  comparisonBars: {
    gap: spacing.md,
  },
  comparisonBarRow: {
    gap: spacing.sm,
  },
  comparisonLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  comparisonLabel: {
    fontSize: typography.size.sm,
  },
  comparisonBarBg: {
    height: 24,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  comparisonBarFill: {
    height: '100%',
    borderRadius: borderRadius.md,
  },
  comparisonValue: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    marginTop: spacing.xs,
  },
  budgetProgress: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  budgetTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  budgetPercent: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  budgetBarBg: {
    height: 16,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  budgetBarFill: {
    height: '100%',
  },
  budgetBarSaved: {
    height: '100%',
  },
  budgetLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: typography.size.xs,
  },
  emptyState: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.size.md,
  },
  bottomSpacer: {
    height: 100,
  },
});
