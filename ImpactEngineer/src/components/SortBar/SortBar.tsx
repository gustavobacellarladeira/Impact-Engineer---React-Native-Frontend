/**
 * SortBar Component
 * Dropdown to sort transactions by date or amount
 */

import React, { memo, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { SortOption, SortOptionItem } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, typography, shadows } from '../../theme';
import { triggerLightImpact, triggerSelection } from '../../utils/haptics';

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
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const activeLabel =
    SORT_OPTIONS.find(o => o.key === activeSort)?.label || 'Sort';

  const handleSelect = useCallback(
    (sort: SortOption) => {
      triggerSelection();
      onSortChange(sort);
      setModalVisible(false);
    },
    [onSortChange],
  );

  const handleOpenModal = useCallback(() => {
    triggerLightImpact();
    setModalVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.sortButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={handleOpenModal}
        accessibilityRole="button"
        accessibilityLabel={`Sort by ${activeLabel}`}
      >
        <Text style={styles.sortIcon}>↕️</Text>
        <Text style={[styles.sortText, { color: colors.textPrimary }]}>
          {activeLabel}
        </Text>
        <Text style={[styles.chevron, { color: colors.textSecondary }]}>▼</Text>
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
          <View style={[styles.dropdown, { backgroundColor: colors.surface }]}>
            <Text
              style={[styles.dropdownTitle, { color: colors.textSecondary }]}
            >
              Sort By
            </Text>
            {SORT_OPTIONS.map(option => {
              const isActive = activeSort === option.key;
              return (
                <Pressable
                  key={option.key}
                  style={[
                    styles.dropdownItem,
                    isActive && { backgroundColor: colors.primaryLight + '20' },
                  ]}
                  onPress={() => handleSelect(option.key)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      { color: isActive ? colors.primary : colors.textPrimary },
                      isActive && { fontWeight: typography.weight.semibold },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isActive && (
                    <Text style={[styles.checkmark, { color: colors.primary }]}>
                      ✓
                    </Text>
                  )}
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
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  sortIcon: {
    fontSize: typography.size.sm,
    marginRight: spacing.xs,
  },
  sortText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  chevron: {
    fontSize: 8,
    marginLeft: spacing.xs,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: '80%',
    maxWidth: 300,
    ...shadows.lg,
  },
  dropdownTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
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
  dropdownItemText: {
    fontSize: typography.size.md,
  },
  checkmark: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
});
