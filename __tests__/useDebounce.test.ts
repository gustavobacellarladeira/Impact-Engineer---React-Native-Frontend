/**
 * useDebounce Hook Tests
 */

import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from '../src/hooks/useDebounce';

jest.useFakeTimers();

interface TestProps {
  value: string;
}

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook<string, TestProps>(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } },
    );

    // Update the value
    rerender({ value: 'updated' });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now value should be updated
    expect(result.current).toBe('updated');
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook<string, TestProps>(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } },
    );

    // Rapid changes
    rerender({ value: 'change1' });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'change2' });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'change3' });

    // Should still be initial
    expect(result.current).toBe('initial');

    // Wait for debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should be the last value
    expect(result.current).toBe('change3');
  });
});
