/**
 * Component Tests
 * Tests for UI components
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState } from '../src/components/EmptyState/EmptyState';
import { ErrorState } from '../src/components/ErrorState/ErrorState';
import { SectionHeader } from '../src/components/SectionHeader/SectionHeader';

// Mock the theme context
jest.mock('../src/theme/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      textPrimary: '#000000',
      textSecondary: '#666666',
      primary: '#6366F1',
      surface: '#FFFFFF',
      background: '#F8FAFC',
    },
    isDark: false,
  }),
}));

// Mock haptics
jest.mock('../src/utils/haptics', () => ({
  triggerMediumImpact: jest.fn(),
  triggerLightImpact: jest.fn(),
}));

describe('EmptyState', () => {
  it('renders with default props', () => {
    const { getByText } = render(<EmptyState />);
    expect(getByText('No transactions found')).toBeTruthy();
    expect(getByText('Try adjusting your filters or search terms.')).toBeTruthy();
  });

  it('renders with custom title', () => {
    const { getByText } = render(<EmptyState title="Custom Title" />);
    expect(getByText('Custom Title')).toBeTruthy();
  });

  it('renders with custom message', () => {
    const { getByText } = render(<EmptyState message="Custom message" />);
    expect(getByText('Custom message')).toBeTruthy();
  });

  it('shows search emoji when filtered', () => {
    const { getByText } = render(<EmptyState isFiltered={true} />);
    expect(getByText('🔍')).toBeTruthy();
  });

  it('shows empty mailbox emoji when not filtered', () => {
    const { getByText } = render(<EmptyState isFiltered={false} />);
    expect(getByText('📭')).toBeTruthy();
  });

  it('renders container view', () => {
    const { getByText } = render(<EmptyState />);
    expect(getByText('No transactions found')).toBeTruthy();
  });
});

describe('ErrorState', () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    mockOnRetry.mockClear();
  });

  it('renders with default message', () => {
    const { getByText } = render(<ErrorState onRetry={mockOnRetry} />);
    expect(getByText('Oops!')).toBeTruthy();
    expect(getByText('Something went wrong. Please try again.')).toBeTruthy();
  });

  it('renders with custom message', () => {
    const { getByText } = render(
      <ErrorState message="Network error" onRetry={mockOnRetry} />
    );
    expect(getByText('Network error')).toBeTruthy();
  });

  it('renders retry button', () => {
    const { getByText } = render(<ErrorState onRetry={mockOnRetry} />);
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('calls onRetry when button is pressed', () => {
    const { getByText } = render(<ErrorState onRetry={mockOnRetry} />);
    fireEvent.press(getByText('Try Again'));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('shows warning emoji', () => {
    const { getByText } = render(<ErrorState onRetry={mockOnRetry} />);
    expect(getByText('⚠️')).toBeTruthy();
  });

  it('has correct accessibility label for retry button', () => {
    const { getByLabelText } = render(<ErrorState onRetry={mockOnRetry} />);
    expect(getByLabelText('Retry loading transactions')).toBeTruthy();
  });
});

describe('SectionHeader', () => {
  it('renders title correctly', () => {
    const { getByText } = render(<SectionHeader title="Today" />);
    expect(getByText('Today')).toBeTruthy();
  });

  it('renders with count', () => {
    const { getByText } = render(<SectionHeader title="Today" count={5} />);
    // The count is rendered inside the same text as a child
    expect(getByText(/Today/)).toBeTruthy();
    expect(getByText(/(5)/)).toBeTruthy();
  });

  it('renders different section titles', () => {
    const { getByText: getYesterday } = render(<SectionHeader title="Yesterday" />);
    expect(getYesterday('Yesterday')).toBeTruthy();
  });
});
