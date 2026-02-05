/**
 * SortBar Component
 * Dropdown to sort transactions by date or amount
 */

import React, { memo, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { SortOption, SortOptionItem } from '../../types';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} from '../../theme';

interface SortBarProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: SortOptionItem[] = [
  { key: 'date_desc', label: 'Newest First' },
  { key: 'date_asc', label: 'Oldest First' },
  { key: 'amount_desc', label: 'Highest Amount' },
  { key: 'amount_asc', label: 'Lowest Amount' },
];

function SortBarComponent({ activeSort, onSortChange }: SortBarProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const activeLabel =
    SORT_OPTIONS.find(o => o.key === activeSort)?.label || 'Sort';

  const handleSelect = useCallback(
    (sort: SortOption) => {
      onSortChange(sort);
      setModalVisible(false);
    },
    [onSortChange],
  );

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.sortButton}
        onPress={() => setModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={`Sort by ${activeLabel}`}
      >
        <Text style={styles.sortIcon}>↕️</Text>
        <Text style={styles.sortText}>{activeLabel}</Text>
        <Text style={styles.chevron}>▼</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Sort By</Text>
            {SORT_OPTIONS.map(option => {
              const isActive = activeSort === option.key;
              return (
                <Pressable
                  key={option.key}
                  style={[
                    styles.dropdownItem,
                    isActive && styles.dropdownItemActive,
                  ]}
                  onPress={() => handleSelect(option.key)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      isActive && styles.dropdownItemTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isActive && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export const SortBar = memo(SortBarComponent);

const styles = StyleSheet.create({
  container: {
    // No padding - parent controls spacing
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortIcon: {
    fontSize: typography.size.sm,
    marginRight: spacing.xs,
  },
  sortText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.textPrimary,
  },
  chevron: {
    fontSize: 8,
    marginLeft: spacing.xs,
    color: colors.textSecondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: '80%',
    maxWidth: 300,
    ...shadows.lg,
  },
  dropdownTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  dropdownItemActive: {
    backgroundColor: colors.primaryLight + '20',
  },
  dropdownItemText: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
  },
  dropdownItemTextActive: {
    fontWeight: typography.weight.semibold,
    color: colors.primary,
  },
  checkmark: {
    fontSize: typography.size.lg,
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
});
