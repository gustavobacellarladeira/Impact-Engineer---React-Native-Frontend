/**
 * EmptyState Component
 * Displayed when no transactions match the current filters
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface EmptyStateProps {
  title?: string;
  message?: string;
  isFiltered?: boolean;
}

function EmptyStateComponent({
  title = 'No transactions found',
  message = 'Try adjusting your filters or search terms.',
  isFiltered = false,
}: EmptyStateProps) {
  return (
    <View style={styles.container} accessibilityRole="text">
      <Text style={styles.emoji}>{isFiltered ? '🔍' : '📭'}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export const EmptyState = memo(EmptyStateComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
