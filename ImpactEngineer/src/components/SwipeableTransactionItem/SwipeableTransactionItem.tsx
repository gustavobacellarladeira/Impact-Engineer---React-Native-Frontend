/**
 * SwipeableTransactionItem Component
 * Transaction item with swipe actions for delete and categorize
 */

import React, { memo, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
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
import {
  triggerLightImpact,
  triggerWarning,
  triggerSelection,
} from '../../utils/haptics';

// Fixed height for getItemLayout optimization
export const TRANSACTION_ITEM_HEIGHT = 80;

interface SwipeableTransactionItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  onCategorize?: (transaction: Transaction) => void;
}

function SwipeableTransactionItemComponent({
  transaction,
  onPress,
  onDelete,
  onCategorize,
}: SwipeableTransactionItemProps) {
  const swipeableRef = useRef<Swipeable>(null);
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;
  const amountPrefix = isIncome ? '+' : '-';
  const IconComponent = getCategoryIcon(transaction.category);

  const handlePressIn = useCallback(() => {
    triggerLightImpact();
  }, []);

  const handleDelete = useCallback(() => {
    triggerWarning();
    swipeableRef.current?.close();
    onDelete?.(transaction);
  }, [onDelete, transaction]);

  const handleCategorize = useCallback(() => {
    triggerSelection();
    swipeableRef.current?.close();
    onCategorize?.(transaction);
  }, [onCategorize, transaction]);

  const handleSwipeOpen = useCallback(() => {
    triggerLightImpact();
  }, []);

  // Render right swipe actions (delete)
  const renderRightActions = useCallback(
    (
      progress: Animated.AnimatedInterpolation<number>,
      _dragX: Animated.AnimatedInterpolation<number>,
    ) => {
      const translateX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [80, 0],
      });

      const scale = progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.8, 0.9, 1],
      });

      return (
        <Animated.View
          style={[
            styles.rightActionsContainer,
            { transform: [{ translateX }] },
          ]}
        >
          <Pressable
            style={styles.deleteAction}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete transaction"
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              <Text style={styles.actionIcon}>🗑️</Text>
              <Text style={styles.actionText}>Delete</Text>
            </Animated.View>
          </Pressable>
        </Animated.View>
      );
    },
    [handleDelete],
  );

  // Render left swipe actions (categorize)
  const renderLeftActions = useCallback(
    (
      progress: Animated.AnimatedInterpolation<number>,
      _dragX: Animated.AnimatedInterpolation<number>,
    ) => {
      const translateX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [-80, 0],
      });

      const scale = progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.8, 0.9, 1],
      });

      return (
        <Animated.View
          style={[styles.leftActionsContainer, { transform: [{ translateX }] }]}
        >
          <Pressable
            style={styles.categorizeAction}
            onPress={handleCategorize}
            accessibilityRole="button"
            accessibilityLabel="Change category"
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              <Text style={styles.actionIcon}>🏷️</Text>
              <Text style={styles.actionText}>Category</Text>
            </Animated.View>
          </Pressable>
        </Animated.View>
      );
    },
    [handleCategorize],
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      rightThreshold={40}
      leftThreshold={40}
      overshootRight={false}
      overshootLeft={false}
      friction={2}
      onSwipeableOpen={handleSwipeOpen}
    >
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
        accessibilityHint="Double tap to view details. Swipe left to delete, swipe right to change category."
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
    </Swipeable>
  );
}

// Memoize to prevent unnecessary re-renders in FlatList
export const SwipeableTransactionItem = memo(SwipeableTransactionItemComponent);

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
  // Swipe action styles
  rightActionsContainer: {
    width: 80,
    marginVertical: spacing.xs,
    marginRight: spacing.lg,
  },
  leftActionsContainer: {
    width: 80,
    marginVertical: spacing.xs,
    marginLeft: spacing.lg,
  },
  deleteAction: {
    flex: 1,
    backgroundColor: colors.expense,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  categorizeAction: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  actionText: {
    color: colors.surface,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
});
