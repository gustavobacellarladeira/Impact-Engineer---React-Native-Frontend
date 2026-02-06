/**
 * Date Utility Tests
 */

import {
  isToday,
  isYesterday,
  getDaysDifference,
  formatTime,
  formatDate,
  getDayName,
  getDateSection,
} from '../src/utils/date';

describe('isToday', () => {
  it('returns true for today', () => {
    const today = new Date();
    expect(isToday(today)).toBe(true);
  });

  it('returns false for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });

  it('returns false for a week ago', () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    expect(isToday(weekAgo)).toBe(false);
  });
});

describe('isYesterday', () => {
  it('returns true for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isYesterday(yesterday)).toBe(true);
  });

  it('returns false for today', () => {
    const today = new Date();
    expect(isYesterday(today)).toBe(false);
  });

  it('returns false for two days ago', () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    expect(isYesterday(twoDaysAgo)).toBe(false);
  });
});

describe('getDaysDifference', () => {
  it('returns 0 for same day', () => {
    const date = new Date();
    expect(getDaysDifference(date, date)).toBe(0);
  });

  it('returns 1 for one day difference', () => {
    const date1 = new Date('2026-02-05');
    const date2 = new Date('2026-02-04');
    expect(getDaysDifference(date1, date2)).toBe(1);
  });

  it('returns 7 for one week difference', () => {
    const date1 = new Date('2026-02-10');
    const date2 = new Date('2026-02-03');
    expect(getDaysDifference(date1, date2)).toBe(7);
  });
});

describe('formatTime', () => {
  it('formats morning time correctly', () => {
    const date = new Date('2026-02-05T09:30:00');
    expect(formatTime(date)).toMatch(/9:30\s*AM/);
  });

  it('formats afternoon time correctly', () => {
    const date = new Date('2026-02-05T14:45:00');
    expect(formatTime(date)).toMatch(/2:45\s*PM/);
  });
});

describe('formatDate', () => {
  it('formats today with time', () => {
    const today = new Date();
    const isoString = today.toISOString();
    const result = formatDate(isoString);
    expect(result).toContain('Today');
  });

  it('formats yesterday with time', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isoString = yesterday.toISOString();
    const result = formatDate(isoString);
    expect(result).toContain('Yesterday');
  });

  it('formats date within last 7 days with day name', () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const isoString = threeDaysAgo.toISOString();
    const result = formatDate(isoString);
    // Should contain a day name like Monday, Tuesday, etc.
    expect(result).toMatch(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  });

  it('formats older dates with month and day', () => {
    const oldDate = new Date('2026-01-15T10:00:00');
    const result = formatDate(oldDate.toISOString());
    expect(result).toContain('Jan');
    expect(result).toContain('15');
  });

  it('includes year for dates from previous year', () => {
    const lastYear = new Date('2025-06-15T10:00:00');
    const result = formatDate(lastYear.toISOString());
    expect(result).toContain('2025');
  });
});

describe('getDayName', () => {
  it('returns a valid day name', () => {
    const date = new Date();
    const dayName = getDayName(date);
    const validDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    expect(validDays).toContain(dayName);
  });

  it('returns different day names for different dates', () => {
    const day1 = new Date('2026-02-05T12:00:00');
    const day2 = new Date('2026-02-06T12:00:00');
    expect(getDayName(day1)).not.toBe(getDayName(day2));
  });

  it('returns full day name not abbreviated', () => {
    const date = new Date('2026-02-05T12:00:00');
    const dayName = getDayName(date);
    expect(dayName.length).toBeGreaterThan(2);
  });
});

describe('getDateSection', () => {
  it('returns Today for today', () => {
    const today = new Date();
    const result = getDateSection(today.toISOString());
    expect(result).toBe('Today');
  });

  it('returns Yesterday for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const result = getDateSection(yesterday.toISOString());
    expect(result).toBe('Yesterday');
  });

  it('returns All for older dates', () => {
    const oldDate = new Date('2026-01-01');
    const result = getDateSection(oldDate.toISOString());
    expect(result).toBe('All');
  });

  it('returns All for dates more than 2 days ago', () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const result = getDateSection(threeDaysAgo.toISOString());
    expect(result).toBe('All');
  });
});
