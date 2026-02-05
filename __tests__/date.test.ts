/**
 * Date Utility Tests
 */

import {
  isToday,
  isYesterday,
  getDaysDifference,
  formatTime,
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
