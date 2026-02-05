/**
 * Currency Formatting Utilities
 * Locale-aware currency formatting for USD
 */

/**
 * Formats a number as USD currency
 * @param amount - The amount to format
 * @param showSign - Whether to show + for positive amounts
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  showSign: boolean = false,
): string => {
  const absAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  if (showSign) {
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  }

  return amount >= 0 ? formatted : `-${formatted}`;
};

/**
 * Gets the absolute value formatted as currency
 * Used when the sign is indicated by color instead
 */
export const formatAbsoluteCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
};
