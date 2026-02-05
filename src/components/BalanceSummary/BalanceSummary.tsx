/**
 * BalanceSummary Component
 * Compact balance display showing net income/expense for the filtered transactions
 */

import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, typography, shadows } from '../../theme';
import { formatCurrency } from '../../utils/currency';
import { triggerLightImpact } from '../../utils/haptics';
import { Transaction } from '../../types';

interface BalanceSummaryProps {
  transactions: Transaction[];
  onPress?: () => void;
}

// Arrow icons for trend indicator
const TrendUpIcon = ({ size = 16, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 6l-9.5 9.5-5-5L1 18"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 6h6v6"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TrendDownIcon = ({ size = 16, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 18l-9.5-9.5-5 5L1 6"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 18h6v-6"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Equals icon for balanced
const BalancedIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 9h16M4 15h16"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function BalanceSummaryComponent({
  transactions,
  onPress,
}: BalanceSummaryProps) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);

  // Calculate stats
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = totalIncome - totalExpenses;
    const transactionCount = transactions.length;

    return {
      totalIncome,
      totalExpenses,
      balance,
      transactionCount,
    };
  }, [transactions]);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    triggerLightImpact();
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Determine balance status
  const isPositive = stats.balance > 0;
  const isNegative = stats.balance < 0;
  const balanceColor = isPositive
    ? colors.success
    : isNegative
    ? colors.error
    : colors.textSecondary;

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Net balance ${formatCurrency(
        stats.balance,
      )}, tap for details`}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? colors.surface : colors.background,
            borderColor: colors.border,
          },
          animatedStyle,
        ]}
      >
        {/* Main Balance */}
        <View style={styles.mainSection}>
          <View style={styles.balanceRow}>
            <View style={styles.trendIcon}>
              {isPositive ? (
                <TrendUpIcon color={colors.success} size={14} />
              ) : isNegative ? (
                <TrendDownIcon color={colors.error} size={14} />
              ) : (
                <BalancedIcon color={colors.textSecondary} size={14} />
              )}
            </View>
            <Text
              style={[styles.balanceAmount, { color: balanceColor }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {isPositive ? '+' : ''}
              {formatCurrency(stats.balance)}
            </Text>
          </View>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
            Net Balance
          </Text>
        </View>

        {/* Income/Expense Summary */}
        <View
          style={[styles.detailsSection, { borderLeftColor: colors.border }]}
        >
          <View style={styles.detailRow}>
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Income
            </Text>
            <Text
              style={[styles.detailValue, { color: colors.success }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              +{formatCurrency(stats.totalIncome)}
            </Text>
          </View>
          <View style={[styles.detailRow, { marginBottom: 0 }]}>
            <View style={[styles.dot, { backgroundColor: colors.error }]} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Expenses
            </Text>
            <Text
              style={[styles.detailValue, { color: colors.error }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              -{formatCurrency(stats.totalExpenses)}
            </Text>
          </View>
        </View>

        {/* Transaction Count */}
        <View style={[styles.countSection, { borderLeftColor: colors.border }]}>
          <Text style={[styles.countValue, { color: colors.textPrimary }]}>
            {stats.transactionCount}
          </Text>
          <Text style={[styles.countLabel, { color: colors.textSecondary }]}>
            transactions
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const BalanceSummary = memo(BalanceSummaryComponent);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  mainSection: {
    flex: 1,
    minWidth: 80,
    maxWidth: 120,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    marginRight: 4,
    width: 14,
  },
  balanceAmount: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    flex: 1,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: typography.weight.medium,
    marginTop: 2,
    marginLeft: 18,
  },
  detailsSection: {
    flex: 2,
    paddingHorizontal: spacing.sm,
    borderLeftWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  detailLabel: {
    fontSize: 10,
    minWidth: 45,
  },
  detailValue: {
    fontSize: 11,
    fontWeight: typography.weight.semibold,
    flex: 1,
    textAlign: 'right',
  },
  countSection: {
    alignItems: 'center',
    paddingLeft: spacing.sm,
    borderLeftWidth: 1,
    minWidth: 55,
  },
  countValue: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  countLabel: {
    fontSize: 9,
    fontWeight: typography.weight.medium,
  },
});
