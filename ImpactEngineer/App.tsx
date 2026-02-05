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
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { ThemeProvider } from './src/theme';
import { TransactionHistoryScreen } from './src/screens';

// Loading component for PersistGate
const LoadingView = () => (
  <View style={styles.loading}>
    <ActivityIndicator size="large" color="#6366F1" />
  </View>
);

function App() {
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <Provider store={store}>
        <PersistGate loading={<LoadingView />} persistor={persistor}>
          <ThemeProvider>
            <SafeAreaProvider>
              <TransactionHistoryScreen />
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
