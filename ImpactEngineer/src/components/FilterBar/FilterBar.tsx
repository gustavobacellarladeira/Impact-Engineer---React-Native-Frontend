/**
 * FilterBar Component
 * Transaction type filter buttons (All / Income / Expenses)
 */

import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FilterButtonType, FilterOption } from '../../types';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} from '../../theme';

interface FilterBarProps {
  activeFilter: FilterButtonType;
  onFilterChange: (filter: FilterButtonType) => void;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expenses' },
];

function FilterBarComponent({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <View style={styles.container}>
      {FILTER_OPTIONS.map(option => {
        const isActive = activeFilter === option.key;
        return (
          <TouchableOpacity
            key={option.key}
            style={[styles.filterButton, isActive && styles.filterButtonActive]}
            onPress={() => onFilterChange(option.key)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${option.label}`}
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[styles.filterText, isActive && styles.filterTextActive]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const FilterBar = memo(FilterBarComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.filterInactive,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  filterButtonActive: {
    backgroundColor: colors.filterActive,
    borderColor: colors.filterActive,
  },
  filterText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.filterInactiveText,
  },
  filterTextActive: {
    color: colors.filterActiveText,
  },
});
