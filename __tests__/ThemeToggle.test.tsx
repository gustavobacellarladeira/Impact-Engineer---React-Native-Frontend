/**
 * ThemeToggle Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeToggle } from '../src/components/ThemeToggle/ThemeToggle';

const mockToggleTheme = jest.fn();

// Mock the theme context
jest.mock('../src/theme/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      textPrimary: '#000000',
      surfaceSecondary: '#F1F5F9',
    },
    isDark: false,
    toggleTheme: mockToggleTheme,
  }),
}));

// Mock haptics
jest.mock('../src/utils/haptics', () => ({
  triggerLightImpact: jest.fn(),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with light mode label', () => {
    const { getByLabelText } = render(<ThemeToggle />);
    expect(getByLabelText('Switch to dark mode')).toBeTruthy();
  });

  it('calls toggleTheme when pressed', () => {
    const { getByRole } = render(<ThemeToggle />);
    fireEvent.press(getByRole('button'));
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('renders as accessible button', () => {
    const { getByRole } = render(<ThemeToggle />);
    expect(getByRole('button')).toBeTruthy();
  });
});

describe('ThemeToggle Dark Mode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Override mock to return dark mode
    jest.doMock('../src/theme/ThemeContext', () => ({
      useTheme: () => ({
        colors: {
          textPrimary: '#FFFFFF',
          surfaceSecondary: '#1E293B',
        },
        isDark: true,
        toggleTheme: mockToggleTheme,
      }),
    }));
  });

  it('renders correctly', () => {
    const { getByRole } = render(<ThemeToggle />);
    expect(getByRole('button')).toBeTruthy();
  });
});
