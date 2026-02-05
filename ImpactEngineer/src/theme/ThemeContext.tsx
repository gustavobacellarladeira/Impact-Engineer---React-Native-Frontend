/**
 * Theme Context
 * Provides dark mode support throughout the app
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { lightColors, darkColors, ThemeColors } from './index';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  // Determine if we should use dark mode
  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  // Get the appropriate colors based on theme
  const colors = useMemo(() => {
    return isDark ? darkColors : lightColors;
  }, [isDark]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setThemeMode(current => {
      if (current === 'system') {
        return systemColorScheme === 'dark' ? 'light' : 'dark';
      }
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemColorScheme]);

  // Update status bar style based on theme
  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [isDark]);

  const value = useMemo(
    () => ({
      colors,
      isDark,
      themeMode,
      setThemeMode,
      toggleTheme,
    }),
    [colors, isDark, themeMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook that returns just the colors (for components that only need colors)
export function useThemeColors(): ThemeColors {
  const { colors } = useTheme();
  return colors;
}
