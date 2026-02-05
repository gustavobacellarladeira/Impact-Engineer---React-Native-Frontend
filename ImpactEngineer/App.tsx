/**
 * Impact Engineer - Transaction History App
 * A React Native app for managing personal finances
 *
 * @format
 */

import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { ThemeProvider, useThemeColors } from './src/theme';
import { BottomTabNavigator } from './src/navigation';

// Loading component for PersistGate
const LoadingView = () => (
  <View style={styles.loading}>
    <ActivityIndicator size="large" color="#6366F1" />
  </View>
);

// Navigation theme wrapper to use app theme colors
const ThemedNavigator = () => {
  const colors = useThemeColors();

  const navigationTheme = {
    dark: colors.background === '#0F172A',
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.primary,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '700' as const },
      heavy: { fontFamily: 'System', fontWeight: '900' as const },
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <BottomTabNavigator />
    </NavigationContainer>
  );
};

function App() {
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <Provider store={store}>
        <PersistGate loading={<LoadingView />} persistor={persistor}>
          <ThemeProvider>
            <SafeAreaProvider>
              <ThemedNavigator />
            </SafeAreaProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});

export default App;
