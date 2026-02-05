/**
 * SwipeableTransactionItem Component
 * Transaction item with swipe actions for delete and categorize
 * Supports multi-selection mode with long press
 */

import React, { memo, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { Transaction } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography, borderRadius, shadows } from '../../theme';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { getCategoryIcon, DeleteIcon, TagIcon } from '../Icons';
import {
  triggerLightImpact,
  triggerWarning,
  triggerSelection,
  triggerMediumImpact,
} from '../../utils/haptics';

// Fixed height for getItemLayout optimization
export const TRANSACTION_ITEM_HEIGHT = 80;

// Checkbox Icon
const CheckIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17l-5-5"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface SwipeableTransactionItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  onCategorize?: (transaction: Transaction) => void;
  onLongPress?: (transaction: Transaction) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (transaction: Transaction) => void;
}

function SwipeableTransactionItemComponent({
  transaction,
  onPress,
  onDelete,
  onCategorize,
  onLongPress,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelection,
}: SwipeableTransactionItemProps) {
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;
  const amountPrefix = isIncome ? '+' : '-';
  const IconComponent = getCategoryIcon(transaction.category);

  const handlePressIn = useCallback(() => {
    triggerLightImpact();
  }, []);

  const handleLongPress = useCallback(() => {
    triggerMediumImpact();
    onLongPress?.(transaction);
  }, [onLongPress, transaction]);

  const handlePress = useCallback(() => {
    if (isSelectionMode) {
      triggerSelection();
      onToggleSelection?.(transaction);
    } else {
      onPress?.(transaction);
    }
  }, [isSelectionMode, onToggleSelection, onPress, transaction]);

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
            style={[styles.deleteAction, { backgroundColor: colors.expense }]}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete transaction"
          >
            <Animated.View
              style={[styles.actionContent, { transform: [{ scale }] }]}
            >
              <DeleteIcon size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Delete</Text>
            </Animated.View>
          </Pressable>
        </Animated.View>
      );
    },
    [handleDelete, colors.expense],
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
            style={[
              styles.categorizeAction,
              { backgroundColor: colors.primary },
            ]}
            onPress={handleCategorize}
            accessibilityRole="button"
            accessibilityLabel="Change category"
          >
            <Animated.View
              style={[styles.actionContent, { transform: [{ scale }] }]}
            >
              <TagIcon size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Category</Text>
            </Animated.View>
          </Pressable>
        </Animated.View>
      );
    },
    [handleCategorize, colors.primary],
  );

  // In selection mode, don't render swipe actions
  const swipeRightActions = isSelectionMode ? undefined : renderRightActions;
  const swipeLeftActions = isSelectionMode ? undefined : renderLeftActions;

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={swipeRightActions}
      renderLeftActions={swipeLeftActions}
      rightThreshold={80}
      leftThreshold={80}
      overshootRight={false}
      overshootLeft={false}
      friction={2.5}
      onSwipeableOpen={handleSwipeOpen}
      enabled={!isSelectionMode}
    >
      <Pressable
        style={({ pressed }) => [
          styles.container,
          { backgroundColor: colors.surface },
          pressed && styles.pressed,
          isSelected && {
            backgroundColor: colors.primaryLight + '30',
            borderColor: colors.primary,
            borderWidth: 2,
          },
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        delayLongPress={400}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${
          transaction.merchant
        }, ${amountPrefix}${formatCurrency(Math.abs(transaction.amount))}, ${
          transaction.category
        }${isSelected ? ', selected' : ''}`}
        accessibilityHint={
          isSelectionMode
            ? 'Tap to toggle selection'
            : 'Double tap to view details. Long press to select. Swipe left to delete, swipe right to change category.'
        }
      >
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: isSelected ? colors.primary : 'transparent',
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
          >
            {isSelected && <CheckIcon size={16} color="#FFFFFF" />}
          </View>
        )}

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
          <Text
            style={[styles.merchant, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {transaction.merchant}
          </Text>
          <Text
            style={[styles.category, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
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
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: typography.size.sm,
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  categorizeAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  actionContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    marginTop: spacing.xs,
  },
});
