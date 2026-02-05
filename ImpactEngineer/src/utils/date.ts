/**
 * Date Formatting Utilities
 * Locale-aware date formatting with relative date support
 */

/**
 * Formats an ISO date string to a human-readable format
 * @param isoDate - ISO 8601 date string
 * @returns Formatted date string
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();

  // Check if it's today
  if (isToday(date)) {
    return `Today, ${formatTime(date)}`;
  }

  // Check if it's yesterday
  if (isYesterday(date)) {
    return `Yesterday, ${formatTime(date)}`;
  }

  // Check if it's within the last 7 days
  const daysDiff = getDaysDifference(now, date);
  if (daysDiff < 7) {
    return `${getDayName(date)}, ${formatTime(date)}`;
  }

  // For older dates, show full date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Formats time in 12-hour format
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Gets the day name for a date
 */
export const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

/**
 * Checks if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Checks if a date is yesterday
 */
export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Gets the difference in days between two dates
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Groups transactions by date section (Today, Yesterday, This Week, Earlier)
 */
export const getDateSection = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();

  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  const daysDiff = getDaysDifference(now, date);
  if (daysDiff < 7) {
    return 'This Week';
  }

  if (daysDiff < 30) {
    return 'This Month';
  }

  return 'Earlier';
};
