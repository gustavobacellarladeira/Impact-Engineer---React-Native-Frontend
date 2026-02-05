/**
 * ErrorState Component
 * Displayed when there's an error fetching transactions
 * Includes retry button
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, typography, shadows } from '../../theme';
import { triggerMediumImpact } from '../../utils/haptics';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

function ErrorStateComponent({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  const { colors } = useTheme();

  const handleRetry = useCallback(() => {
    triggerMediumImpact();
    onRetry();
  }, [onRetry]);

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Oops!</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: colors.primary }]}
        onPress={handleRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry loading transactions"
      >
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

export const ErrorState = memo(ErrorStateComponent);

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
    marginBottom: spacing.xl,
  },
  retryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.full,
    ...shadows.md,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
