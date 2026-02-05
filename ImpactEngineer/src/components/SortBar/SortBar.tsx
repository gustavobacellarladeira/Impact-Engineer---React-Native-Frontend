/**
 * SortBar Component
 * Compact dropdown to sort transactions by date or amount
 */

import React, { memo, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SortOption, SortOptionItem } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, typography, shadows } from '../../theme';
import { triggerLightImpact, triggerSelection } from '../../utils/haptics';
import { SortIcon, ChevronDownIcon } from '../Icons';

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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SortBarComponent({ activeSort, onSortChange }: SortBarProps) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  // Animation values
  const scale = useSharedValue(1);
  const chevronRotation = useSharedValue(0);

  const activeLabel =
    SORT_OPTIONS.find(o => o.key === activeSort)?.label || 'Sort';

  const handleSelect = useCallback(
    (sort: SortOption) => {
      triggerSelection();
      onSortChange(sort);
      setModalVisible(false);
      chevronRotation.value = withSpring(0);
    },
    [onSortChange, chevronRotation],
  );

  const handleOpenModal = useCallback(() => {
    triggerLightImpact();
    setModalVisible(true);
    chevronRotation.value = withSpring(180);
  }, [chevronRotation]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    chevronRotation.value = withSpring(0);
  }, [chevronRotation]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, [scale]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedChevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <AnimatedPressable
        style={[
          styles.sortButton,
          {
            backgroundColor: colors.surfaceSecondary,
          },
          animatedButtonStyle,
        ]}
        onPress={handleOpenModal}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`Sort by ${activeLabel}`}
      >
        <SortIcon size={14} color={colors.textSecondary} />
        <Text style={[styles.sortText, { color: colors.textPrimary }]}>
          {activeLabel}
        </Text>
        <Animated.View style={animatedChevronStyle}>
          <ChevronDownIcon size={12} color={colors.textTertiary} />
        </Animated.View>
      </AnimatedPressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.overlay} onPress={handleCloseModal}>
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
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '500' as const,
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
