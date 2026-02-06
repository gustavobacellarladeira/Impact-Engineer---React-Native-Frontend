/**
 * Navigation Tests
 * Tests for the BottomTabNavigator
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

// Mock the entire navigator
jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }: { children: React.ReactNode }) => (
        <View testID="mock-navigator">{children}</View>
      ),
      Screen: ({ name }: { name: string }) => (
        <View testID={`screen-${name}`}>
          <Text>{name}</Text>
        </View>
      ),
    }),
  };
});

// Mock theme
jest.mock('../src/theme', () => ({
  useThemeColors: () => ({
    surface: '#FFFFFF',
    border: '#E2E8F0',
    primary: '#6366F1',
    textSecondary: '#64748B',
  }),
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  borderRadius: { md: 8 },
  shadows: { md: {} },
}));

// Mock the screens
jest.mock('../src/screens/TransactionHistoryScreen', () => ({
  TransactionHistoryScreen: () => null,
}));

jest.mock('../src/screens/AnalyticsScreen', () => ({
  AnalyticsScreen: () => null,
}));

// Mock the Icons
jest.mock('../src/components/Icons/NavigationIcons', () => ({
  ListIcon: () => null,
  AnalyticsIcon: () => null,
}));

import { BottomTabNavigator } from '../src/navigation/BottomTabNavigator';

describe('BottomTabNavigator', () => {
  const renderNavigator = () =>
    render(
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    );

  it('renders the navigator', () => {
    const { getByTestId } = renderNavigator();
    expect(getByTestId('mock-navigator')).toBeTruthy();
  });

  it('renders Transactions screen', () => {
    const { getByTestId } = renderNavigator();
    expect(getByTestId('screen-Transactions')).toBeTruthy();
  });

  it('renders Analytics screen', () => {
    const { getByTestId } = renderNavigator();
    expect(getByTestId('screen-Analytics')).toBeTruthy();
  });
});
