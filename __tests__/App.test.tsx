/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../../App';

// Use fake timers to prevent timer-related warnings
jest.useFakeTimers();

test('renders correctly', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
    // Advance time to allow async operations to complete
    jest.advanceTimersByTime(1000);
  });

  expect(renderer).toBeDefined();
});
