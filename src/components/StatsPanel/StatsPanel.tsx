/**
 * StatsPanel Component
 * Pull-up panel showing transaction statistics
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, typography, shadows } from '../../theme';
import { formatCurrency } from '../../utils/currency';
import { triggerLightImpact } from '../../utils/haptics';
import { Transaction } from '../../types';

interface StatsPanelProps {
  visible: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

// Chart Icon
const ChartIcon = ({ size = 24, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 20V10M12 20V4M6 20v-6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Arrow Up Icon
const ArrowUpIcon = ({ size = 24, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 19V5M5 12l7-7 7 7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Arrow Down Icon
const ArrowDownIcon = ({ size = 24, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5v14M19 12l-7 7-7-7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function StatsPanelComponent({
  visible,
  onClose,
  transactions,
}: StatsPanelProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);

  // Calculate stats
  const stats = React.useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = totalIncome - totalExpenses;

    const incomeCount = transactions.filter(t => t.type === 'income').length;
    const expenseCount = transactions.filter(t => t.type === 'expense').length;

    // Category breakdown
    const categoryTotals = transactions.reduce((acc, t) => {
      const category = t.category;
      if (!acc[category]) {
        acc[category] = { total: 0, count: 0 };
      }
      acc[category].total += Math.abs(t.amount);
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      balance,
      incomeCount,
      expenseCount,
      transactionCount: transactions.length,
      topCategories,
    };
  }, [transactions]);

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose]);

  const gesture = Gesture.Pan()
    .onUpdate(event => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd(event => {
      if (event.translationY > 100) {
        runOnJS(handleClose)();
      }
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom,
            },
            animatedStyle,
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                backgroundColor: colors.surface,
                borderBottomColor: colors.borderLight,
              },
            ]}
          >
            <View
              style={[styles.handleBar, { backgroundColor: colors.border }]}
            />
            <View style={styles.titleRow}>
              <ChartIcon size={24} color={colors.primary} />
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Transaction Stats
              </Text>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Text style={[styles.closeText, { color: colors.primary }]}>
                Done
              </Text>
            </Pressable>
          </View>

          {/* Stats Content */}
          <View style={styles.content}>
            {/* Balance Card */}
            <View
              style={[
                styles.balanceCard,
                { backgroundColor: colors.surface },
                shadows.md,
              ]}
            >
              <Text
                style={[styles.balanceLabel, { color: colors.textSecondary }]}
              >
                Net Balance
              </Text>
              <Text
                style={[
                  styles.balanceAmount,
                  {
                    color: stats.balance >= 0 ? colors.income : colors.expense,
                  },
                ]}
              >
                {stats.balance >= 0 ? '+' : '-'}
                {formatCurrency(Math.abs(stats.balance))}
              </Text>
              <Text
                style={[styles.transactionCount, { color: colors.textHint }]}
              >
                {stats.transactionCount} transactions
              </Text>
            </View>

            {/* Income & Expense Cards */}
            <View style={styles.row}>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.incomeLight },
                ]}
              >
                <View style={styles.statHeader}>
                  <ArrowDownIcon size={20} color={colors.income} />
                  <Text style={[styles.statLabel, { color: colors.income }]}>
                    Income
                  </Text>
                </View>
                <Text style={[styles.statAmount, { color: colors.income }]}>
                  +{formatCurrency(stats.totalIncome)}
                </Text>
                <Text style={[styles.statCount, { color: colors.income }]}>
                  {stats.incomeCount} transactions
                </Text>
              </View>

              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.expenseLight },
                ]}
              >
                <View style={styles.statHeader}>
                  <ArrowUpIcon size={20} color={colors.expense} />
                  <Text style={[styles.statLabel, { color: colors.expense }]}>
                    Expenses
                  </Text>
                </View>
                <Text style={[styles.statAmount, { color: colors.expense }]}>
                  -{formatCurrency(stats.totalExpenses)}
                </Text>
                <Text style={[styles.statCount, { color: colors.expense }]}>
                  {stats.expenseCount} transactions
                </Text>
              </View>
            </View>

            {/* Top Categories */}
            <View
              style={[
                styles.categoriesCard,
                { backgroundColor: colors.surface },
                shadows.sm,
              ]}
            >
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                Top Categories
              </Text>
              {stats.topCategories.map(([category, data], index) => (
                <View
                  key={category}
                  style={[
                    styles.categoryRow,
                    index < stats.topCategories.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.borderLight,
                    },
                  ]}
                >
                  <View style={styles.categoryInfo}>
                    <Text
                      style={[
                        styles.categoryName,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {category}
                    </Text>
                    <Text
                      style={[
                        styles.categoryCount,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {data.count} transaction{data.count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.categoryTotal,
                      { color: colors.textPrimary },
                    ]}
                  >
                    {formatCurrency(data.total)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

export const StatsPanel = memo(StatsPanelComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  handleBar: {
    width: 36,
    height: 5,
    borderRadius: 3,
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.xl,
  },
  closeText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  balanceCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },
  transactionCount: {
    fontSize: typography.size.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  statAmount: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },
  statCount: {
    fontSize: typography.size.xs,
  },
  categoriesCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.xs,
  },
  categoryCount: {
    fontSize: typography.size.xs,
  },
  categoryTotal: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
