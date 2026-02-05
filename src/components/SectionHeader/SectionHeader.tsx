/**
 * SectionHeader Component
 * Date section header for grouped transactions (Today, Yesterday, This Week, etc.)
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography } from '../../theme';

export interface SectionHeaderProps {
  title: string;
  count?: number;
}

function SectionHeaderComponent({ title, count }: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        {title}
        {count !== undefined && (
          <Text style={[styles.count, { color: colors.textHint }]}>
            {' '}
            ({count})
          </Text>
        )}
      </Text>
    </View>
  );
}

export const SectionHeader = memo(SectionHeaderComponent);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  count: {
    fontWeight: typography.weight.regular,
  },
});
