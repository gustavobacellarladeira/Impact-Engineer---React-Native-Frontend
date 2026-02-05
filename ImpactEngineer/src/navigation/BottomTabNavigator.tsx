/**
 * Bottom Tab Navigator
 * Main navigation for the app with Transactions and Analytics tabs
 */

import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { TransactionHistoryScreen } from '../screens/TransactionHistoryScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { ListIcon, AnalyticsIcon } from '../components/Icons/NavigationIcons';
import { useThemeColors, spacing, borderRadius, shadows } from '../theme';

export type RootTabParamList = {
  Transactions: undefined;
  Analytics: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
  Icon: React.FC<{ size?: number; color?: string }>;
}

const AnimatedTabIcon: React.FC<TabIconProps> = ({
  focused,
  color,
  size,
  Icon,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(focused ? 1.1 : 1, {
      damping: 15,
      stiffness: 150,
    });

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Icon size={size} color={color} />
    </Animated.View>
  );
};

export const BottomTabNavigator: React.FC = () => {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: spacing.sm,
          paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
          height: Platform.OS === 'ios' ? 88 : 70,
          ...shadows.md,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: spacing.xs,
        },
      }}
    >
      <Tab.Screen
        name="Transactions"
        component={TransactionHistoryScreen}
        options={{
          tabBarLabel: 'Transactions',
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedTabIcon
              focused={focused}
              color={color}
              size={size}
              Icon={ListIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedTabIcon
              focused={focused}
              color={color}
              size={size}
              Icon={AnalyticsIcon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
