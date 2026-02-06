/**
 * TransactionSkeleton Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { TransactionSkeleton } from '../src/components/TransactionSkeleton/TransactionSkeleton';

// Mock the theme context
jest.mock('../src/theme/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      surface: '#FFFFFF',
      border: '#E2E8F0',
    },
    isDark: false,
  }),
}));

describe('TransactionSkeleton', () => {
  it('renders default 5 skeleton items', () => {
    const { UNSAFE_getAllByType } = render(<TransactionSkeleton />);
    // Each skeleton has its own view structure
    const views = UNSAFE_getAllByType(require('react-native').View);
    // Container + 5 items * sub-views
    expect(views.length).toBeGreaterThan(5);
  });

  it('renders custom count of skeleton items', () => {
    const { UNSAFE_getAllByType } = render(<TransactionSkeleton count={3} />);
    const views = UNSAFE_getAllByType(require('react-native').View);
    expect(views.length).toBeGreaterThan(3);
  });

  it('renders skeleton with single item', () => {
    const { UNSAFE_getAllByType } = render(<TransactionSkeleton count={1} />);
    const views = UNSAFE_getAllByType(require('react-native').View);
    expect(views.length).toBeGreaterThan(0);
  });

  it('renders skeleton with zero items', () => {
    const { UNSAFE_getAllByType } = render(<TransactionSkeleton count={0} />);
    const views = UNSAFE_getAllByType(require('react-native').View);
    // Just the wrapper view
    expect(views.length).toBe(1);
  });
});
