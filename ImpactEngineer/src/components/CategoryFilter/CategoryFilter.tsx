/**
 * CategoryFilter Component
 * Horizontal scrollable list of category chips for filtering
 * With smooth animated transitions using react-native-reanimated
 */

import React, { memo, useMemo, useCallback } from 'react';
import { StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { CategoryFilter as CategoryFilterType } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, typography } from '../../theme';
import { triggerSelection } from '../../utils/haptics';
import { getCategoryIcon } from '../Icons';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: CategoryFilterType;
  onCategoryChange: (category: CategoryFilterType) => void;
}

interface AnimatedCategoryChipProps {
  category: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
  colors: {
    primary: string;
    surfaceSecondary: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
  };
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function AnimatedCategoryChip({
  category,
  label,
  isActive,
  onPress,
  colors,
}: AnimatedCategoryChipProps) {
  const scale = useSharedValue(1);
  const progress = useSharedValue(isActive ? 1 : 0);

  // Get the icon for this category
  const IconComponent = getCategoryIcon(category);

  // Update progress when isActive changes
  React.useEffect(() => {
    progress.value = withSpring(isActive ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isActive, progress]);

  const animatedChipStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.surfaceSecondary, colors.primary + '20'],
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.border, colors.primary],
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
      [colors.textSecondary, colors.primary],
    );

    return { color };
  });

  // For icon color - we need to compute it
  const iconColor = isActive ? colors.primary : colors.textSecondary;

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    triggerSelection();
    onPress();
  }, [onPress]);

  return (
    <AnimatedPressable
      style={[styles.chip, animatedChipStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Filter by ${label}`}
      accessibilityState={{ selected: isActive }}
    >
      <IconComponent size={14} color={iconColor} />
      <Animated.Text style={[styles.chipText, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </AnimatedPressable>
  );
}

function CategoryFilterComponent({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const { colors } = useTheme();
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
          <AnimatedCategoryChip
            key={category}
            category={category}
            label={label}
            isActive={isActive}
            onPress={() => onCategoryChange(category)}
            colors={colors}
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  chipText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});
