/**
 * EmptyState Component
 * Displayed when no transactions match the current filters
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography } from '../../theme';

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
  const { colors } = useTheme();

  return (
    <View style={styles.container} accessibilityRole="text">
      <Text style={styles.emoji}>{isFiltered ? '🔍' : '📭'}</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
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
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: typography.size.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});
