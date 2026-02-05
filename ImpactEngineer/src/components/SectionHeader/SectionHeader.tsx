/**
 * SectionHeader Component
 * Date section header for grouped transactions (Today, Yesterday, This Week, etc.)
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export interface SectionHeaderProps {
  title: string;
  count?: number;
}

function SectionHeaderComponent({ title, count }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
        {count !== undefined && <Text style={styles.count}> ({count})</Text>}
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
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  count: {
    fontWeight: typography.weight.regular,
    color: colors.textHint,
  },
});
