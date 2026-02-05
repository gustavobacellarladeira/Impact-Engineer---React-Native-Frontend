/**
 * DateFilterBar Component
 * Quick date range filters (All, Today, This Week, This Month)
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius, typography } from '../../theme';
import { triggerSelection } from '../../utils/haptics';

export type DateRange = 'all' | 'today' | 'week' | 'month';

interface DateFilterBarProps {
  activeRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

const DATE_RANGES: {
  id: DateRange;
  label: string;
  icon: React.FC<{ size: number; color: string }>;
}[] = [
  {
    id: 'all',
    label: 'All Time',
    icon: ({ size, color }) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 4h16v16H4V4zM4 10h16"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
  {
    id: 'today',
    label: 'Today',
    icon: ({ size, color }) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 8v4l2 2"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
  {
    id: 'week',
    label: 'This Week',
    icon: ({ size, color }) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
  {
    id: 'month',
    label: 'This Month',
    icon: ({ size, color }) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function DateFilterItem({
  range,
  isActive,
  onPress,
}: {
  range: (typeof DATE_RANGES)[0];
  isActive: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const IconComponent = range.icon;

  return (
    <AnimatedPressable
      style={[
        styles.filterItem,
        {
          backgroundColor: isActive ? colors.primary : colors.surface,
          borderColor: isActive ? colors.primary : colors.border,
        },
        animatedStyle,
      ]}
      onPress={() => {
        triggerSelection();
        onPress();
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`Filter by ${range.label}`}
    >
      <IconComponent
        size={14}
        color={isActive ? '#FFFFFF' : colors.textSecondary}
      />
      <Text
        style={[
          styles.filterText,
          { color: isActive ? '#FFFFFF' : colors.textPrimary },
        ]}
      >
        {range.label}
      </Text>
    </AnimatedPressable>
  );
}

function DateFilterBarComponent({
  activeRange,
  onRangeChange,
}: DateFilterBarProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={{ backgroundColor: colors.background }}
    >
      {DATE_RANGES.map(range => (
        <DateFilterItem
          key={range.id}
          range={range}
          isActive={activeRange === range.id}
          onPress={() => onRangeChange(range.id)}
        />
      ))}
    </ScrollView>
  );
}

export const DateFilterBar = memo(DateFilterBarComponent);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: spacing.xs,
  },
  filterText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});
