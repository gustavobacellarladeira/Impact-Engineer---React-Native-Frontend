/**
 * Currency Utility Tests
 */

import { formatCurrency, formatAbsoluteCurrency } from '../src/utils/currency';

describe('formatCurrency', () => {
  it('formats positive amount correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats negative amount correctly', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats with sign for positive amount', () => {
    expect(formatCurrency(100, true)).toBe('+$100.00');
  });

  it('formats with sign for negative amount', () => {
    expect(formatCurrency(-100, true)).toBe('-$100.00');
  });

  it('handles small amounts correctly', () => {
    expect(formatCurrency(0.99)).toBe('$0.99');
  });

  it('handles large amounts correctly', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });
});

describe('formatAbsoluteCurrency', () => {
  it('formats positive amount as absolute', () => {
    expect(formatAbsoluteCurrency(100)).toBe('$100.00');
  });

  it('formats negative amount as absolute', () => {
    expect(formatAbsoluteCurrency(-100)).toBe('$100.00');
  });

  it('formats zero correctly', () => {
    expect(formatAbsoluteCurrency(0)).toBe('$0.00');
  });
});
