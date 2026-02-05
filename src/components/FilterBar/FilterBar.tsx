/**
 * FilterBar Component
 * Transaction type filter buttons (All / Income / Expenses)
 * With smooth animated transitions using react-native-reanimated
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { FilterButtonType, FilterOption } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, typography, shadows } from '../../theme';
import { triggerLightImpact } from '../../utils/haptics';

interface FilterBarProps {
  activeFilter: FilterButtonType;
  onFilterChange: (filter: FilterButtonType) => void;
}

interface AnimatedFilterButtonProps {
  option: FilterOption;
  isActive: boolean;
  onPress: () => void;
  colors: {
    filterInactive: string;
    filterActive: string;
    border: string;
    filterInactiveText: string;
    filterActiveText: string;
  };
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expenses' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function AnimatedFilterButton({
  option,
  isActive,
  onPress,
  colors,
}: AnimatedFilterButtonProps) {
  const scale = useSharedValue(1);
  const progress = useSharedValue(isActive ? 1 : 0);

  // Update progress when isActive changes
  React.useEffect(() => {
    progress.value = withSpring(isActive ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isActive, progress]);

  const animatedButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.filterInactive, colors.filterActive],
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.border, colors.filterActive],
    );

    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: scale.value }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [colors.filterInactiveText, colors.filterActiveText],
    );

    return { color };
  });

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    triggerLightImpact();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  return (
    <AnimatedPressable
      style={[styles.filterButton, animatedButtonStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Filter by ${option.label}`}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.Text style={[styles.filterText, animatedTextStyle]}>
        {option.label}
      </Animated.Text>
    </AnimatedPressable>
  );
}

function FilterBarComponent({ activeFilter, onFilterChange }: FilterBarProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {FILTER_OPTIONS.map(option => (
        <AnimatedFilterButton
          key={option.key}
          option={option}
          isActive={activeFilter === option.key}
          onPress={() => onFilterChange(option.key)}
          colors={colors}
        />
      ))}
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...shadows.sm,
  },
  filterText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
});
