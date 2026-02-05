/**
 * CategoryFilter Component
 * Horizontal scrollable list of category chips for filtering
 */

import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { CategoryFilter as CategoryFilterType } from '../../types';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: CategoryFilterType;
  onCategoryChange: (category: CategoryFilterType) => void;
}

function CategoryFilterComponent({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const allCategories = useMemo(() => ['all', ...categories], [categories]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {allCategories.map(category => {
        const isActive = activeCategory === category;
        const label = category === 'all' ? 'All Categories' : category;

        return (
          <Pressable
            key={category}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onCategoryChange(category)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${label}`}
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export const CategoryFilterBar = memo(CategoryFilterComponent);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: typography.weight.medium,
  },
});
