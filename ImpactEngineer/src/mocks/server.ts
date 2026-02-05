/**
 * MSW Server Setup for React Native
 * Uses native request interception
 */

import { setupServer } from 'msw/native';
import { handlers } from './handlers';

// Create server instance
export const server = setupServer(...handlers);

// Start MSW
export const startMocking = () => {
  server.listen({ onUnhandledRequest: 'bypass' });
  console.log('[MSW] Mocking enabled');
};

// Stop MSW
export const stopMocking = () => {
  server.close();
  console.log('[MSW] Mocking disabled');
};
