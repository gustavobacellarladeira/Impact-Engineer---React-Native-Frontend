/**
 * Impact Engineer - Transaction History App
 * A React Native app for managing personal finances
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TransactionHistoryScreen } from './src/screens';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <TransactionHistoryScreen />
    </SafeAreaProvider>
  );
}

export default App;
