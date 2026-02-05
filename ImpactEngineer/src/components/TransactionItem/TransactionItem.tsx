/**
 * TransactionItem Component
 * Displays a single transaction with merchant, amount, date, and category
 * Color-coded: green for income, red for expenses
 * Supports tap to view transaction details
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Transaction } from '../../types';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '../../theme';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { getCategoryIcon } from '../Icons';
import { triggerLightImpact } from '../../utils/haptics';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

// Fixed height for getItemLayout optimization
export const TRANSACTION_ITEM_HEIGHT = 80;

function TransactionItemComponent({
  transaction,
  onPress,
}: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;
  const amountPrefix = isIncome ? '+' : '-';
  const IconComponent = getCategoryIcon(transaction.category);

  const handlePressIn = useCallback(() => {
    triggerLightImpact();
  }, []);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress?.(transaction)}
      onPressIn={handlePressIn}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${
        transaction.merchant
      }, ${amountPrefix}${formatCurrency(Math.abs(transaction.amount))}, ${
        transaction.category
      }`}
      accessibilityHint="Double tap to view transaction details"
    >
      {/* Category Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isIncome
              ? colors.incomeLight
              : colors.expenseLight,
          },
        ]}
      >
        <IconComponent size={22} color={amountColor} />
      </View>

      {/* Transaction Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.merchant} numberOfLines={1}>
          {transaction.merchant}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {transaction.category} • {formatDate(transaction.date)}
        </Text>
      </View>

      {/* Amount */}
      <View style={styles.amountContainer}>
        <Text
          style={[styles.amount, { color: amountColor }]}
          accessibilityLabel={`${amountPrefix}${formatCurrency(
            Math.abs(transaction.amount),
          )}`}
        >
          {amountPrefix}
          {formatCurrency(Math.abs(transaction.amount))}
        </Text>
      </View>
    </Pressable>
  );
}

// Memoize to prevent unnecessary re-renders in FlatList
export const TransactionItem = memo(TransactionItemComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    height: TRANSACTION_ITEM_HEIGHT,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  merchant: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
});
