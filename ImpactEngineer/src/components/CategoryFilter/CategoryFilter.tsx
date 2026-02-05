/**
 * CategoryFilter Component
 * Horizontal scrollable list of category chips for filtering
 */

import React, { memo, useMemo, useCallback } from 'react';
import { StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { CategoryFilter as CategoryFilterType } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, typography } from '../../theme';
import { triggerSelection } from '../../utils/haptics';

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
  const { colors } = useTheme();
  const allCategories = useMemo(() => ['all', ...categories], [categories]);

  const handleCategoryPress = useCallback(
    (category: string) => {
      triggerSelection();
      onCategoryChange(category);
    },
    [onCategoryChange],
  );

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
            style={[
              styles.chip,
              {
                backgroundColor: isActive
                  ? colors.primary + '15'
                  : colors.surfaceSecondary,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
            onPress={() => handleCategoryPress(category)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${label}`}
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isActive ? colors.primary : colors.textSecondary,
                  fontWeight: isActive
                    ? typography.weight.medium
                    : typography.weight.regular,
                },
              ]}
            >
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
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  chipText: {
    fontSize: typography.size.sm,
  },
});
