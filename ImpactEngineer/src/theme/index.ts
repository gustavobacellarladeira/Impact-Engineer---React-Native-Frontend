/**
 * Theme Constants
 * Centralized design tokens for consistent styling
 */

// Light theme colors
export const lightColors = {
  // Primary colors - Modern indigo/purple
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#A5B4FC',

  // Transaction colors - Softer, more modern tones
  income: '#10B981', // Emerald green for income
  incomeLight: '#D1FAE5',
  expense: '#EF4444', // Softer red for expenses
  expenseLight: '#FEE2E2',

  // Neutral colors - Warmer grays
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',

  // Text colors - Slate tones
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textHint: '#94A3B8',

  // Border colors
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // State colors
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#10B981',

  // Filter button colors
  filterActive: '#6366F1',
  filterInactive: '#FFFFFF',
  filterActiveText: '#FFFFFF',
  filterInactiveText: '#64748B',
};

// Dark theme colors
export const darkColors = {
  // Primary colors - Modern indigo/purple
  primary: '#818CF8',
  primaryDark: '#6366F1',
  primaryLight: '#4F46E5',

  // Transaction colors - Adjusted for dark mode
  income: '#34D399', // Brighter emerald for dark bg
  incomeLight: '#064E3B',
  expense: '#F87171', // Brighter red for dark bg
  expenseLight: '#7F1D1D',

  // Neutral colors - Dark grays
  background: '#0F172A',
  surface: '#1E293B',
  surfaceSecondary: '#334155',

  // Text colors - Light tones
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textHint: '#64748B',

  // Border colors
  border: '#334155',
  borderLight: '#1E293B',

  // State colors
  error: '#F87171',
  errorLight: '#7F1D1D',
  success: '#34D399',

  // Filter button colors
  filterActive: '#818CF8',
  filterInactive: '#1E293B',
  filterActiveText: '#FFFFFF',
  filterInactiveText: '#94A3B8',
};

// Default export for backward compatibility
export const colors = lightColors;

export type ThemeColors = typeof lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  // Font sizes
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
  },
  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Animation durations
export const animation = {
  fast: 150,
  normal: 250,
  slow: 400,
};

// Theme context exports
export { ThemeProvider, useTheme, useThemeColors } from './ThemeContext';
