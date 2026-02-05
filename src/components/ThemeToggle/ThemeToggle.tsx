/**
 * ThemeToggle Component
 * Button to toggle between light and dark mode
 */

import React, { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme';
import { triggerLightImpact } from '../../utils/haptics';

// Sun Icon
const SunIcon = ({ size = 24, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={5} stroke={color} strokeWidth={2} />
    <Path
      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Moon Icon
const MoonIcon = ({ size = 24, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function ThemeToggleComponent() {
  const { isDark, toggleTheme, colors } = useTheme();

  const handlePress = () => {
    triggerLightImpact();
    toggleTheme();
  };

  return (
    <Pressable
      style={[styles.button, { backgroundColor: colors.surfaceSecondary }]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
      }
    >
      {isDark ? (
        <SunIcon size={20} color={colors.textPrimary} />
      ) : (
        <MoonIcon size={20} color={colors.textPrimary} />
      )}
    </Pressable>
  );
}

export const ThemeToggle = memo(ThemeToggleComponent);

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
