/**
 * TransactionSkeleton Component
 * Skeleton loading placeholder for transactions
 */

import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, shadows } from '../../theme';
import { TRANSACTION_ITEM_HEIGHT } from '../TransactionItem';

interface TransactionSkeletonProps {
  count?: number;
}

function SkeletonItem() {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Animated.View
        style={[
          styles.iconPlaceholder,
          { opacity, backgroundColor: colors.border },
        ]}
      />
      <View style={styles.detailsContainer}>
        <Animated.View
          style={[
            styles.titlePlaceholder,
            { opacity, backgroundColor: colors.border },
          ]}
        />
        <Animated.View
          style={[
            styles.subtitlePlaceholder,
            { opacity, backgroundColor: colors.border },
          ]}
        />
      </View>
      <Animated.View
        style={[
          styles.amountPlaceholder,
          { opacity, backgroundColor: colors.border },
        ]}
      />
    </View>
  );
}

function TransactionSkeletonComponent({ count = 5 }: TransactionSkeletonProps) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </View>
  );
}

export const TransactionSkeleton = memo(TransactionSkeletonComponent);

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
  iconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  titlePlaceholder: {
    width: '70%',
    height: 14,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  subtitlePlaceholder: {
    width: '50%',
    height: 12,
    borderRadius: borderRadius.sm,
  },
  amountPlaceholder: {
    width: 70,
    height: 18,
    borderRadius: borderRadius.sm,
  },
});
