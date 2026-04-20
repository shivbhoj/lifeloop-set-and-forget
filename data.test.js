const test = require('node:test');
const assert = require('node:assert');
const { fmtDate, fmtLong, addDays } = require('./data.jsx');

test('fmtDate formats date correctly', (t) => {
  // Today = April 19, 2026
  const date = new Date(2026, 3, 19);
  assert.strictEqual(fmtDate(date), 'Apr 19');

  // Christmas
  const christmas = new Date(2026, 11, 25);
  assert.strictEqual(fmtDate(christmas), 'Dec 25');

  // New Year's Day
  const newYears = new Date(2027, 0, 1);
  assert.strictEqual(fmtDate(newYears), 'Jan 1');

  // Leap Year - Feb 29, 2024
  const leapDay = new Date(2024, 1, 29);
  assert.strictEqual(fmtDate(leapDay), 'Feb 29');
});

test('fmtLong formats date correctly with weekday and long month', (t) => {
  // Today = April 19, 2026 (Sunday)
  const date = new Date(2026, 3, 19);
  assert.strictEqual(fmtLong(date), 'Sunday, April 19');

  // Christmas 2026 (Friday)
  const christmas = new Date(2026, 11, 25);
  assert.strictEqual(fmtLong(christmas), 'Friday, December 25');

  // New Year's Day 2027 (Friday)
  const newYears = new Date(2027, 0, 1);
  assert.strictEqual(fmtLong(newYears), 'Friday, January 1');

  // Leap Day 2024 (Thursday)
  const leapDay = new Date(2024, 1, 29);
  assert.strictEqual(fmtLong(leapDay), 'Thursday, February 29');
});

test('addDays calculates dates correctly', (t) => {
  // Base Date: January 15, 2024
  const baseDate = new Date(2024, 0, 15);

  // 1. Positive addition
  const plus5 = addDays(baseDate, 5);
  assert.strictEqual(plus5.getFullYear(), 2024);
  assert.strictEqual(plus5.getMonth(), 0);
  assert.strictEqual(plus5.getDate(), 20);

  // 2. Negative subtraction
  const minus5 = addDays(baseDate, -5);
  assert.strictEqual(minus5.getFullYear(), 2024);
  assert.strictEqual(minus5.getMonth(), 0);
  assert.strictEqual(minus5.getDate(), 10);

  // 3. Adding 0 days
  const plus0 = addDays(baseDate, 0);
  assert.strictEqual(plus0.getFullYear(), 2024);
  assert.strictEqual(plus0.getMonth(), 0);
  assert.strictEqual(plus0.getDate(), 15);
  assert.notStrictEqual(plus0, baseDate, 'Should return a new Date instance');

  // 4. Cross-month boundary (forward)
  const plus20 = addDays(baseDate, 20); // Jan 15 + 20 days = Feb 4
  assert.strictEqual(plus20.getFullYear(), 2024);
  assert.strictEqual(plus20.getMonth(), 1); // Feb
  assert.strictEqual(plus20.getDate(), 4);

  // 5. Cross-month boundary (backward)
  const minus20 = addDays(baseDate, -20); // Jan 15 - 20 days = Dec 26
  assert.strictEqual(minus20.getFullYear(), 2023);
  assert.strictEqual(minus20.getMonth(), 11); // Dec
  assert.strictEqual(minus20.getDate(), 26);

  // 6. Cross-year boundary (forward)
  const plus365 = addDays(baseDate, 365); // 2024 is leap year, 366 days
  // Jan 15, 2024 + 365 days = Jan 14, 2025
  assert.strictEqual(plus365.getFullYear(), 2025);
  assert.strictEqual(plus365.getMonth(), 0);
  assert.strictEqual(plus365.getDate(), 14);

  // 7. Leap year handling
  const leapDay = new Date(2024, 1, 28); // Feb 28, 2024
  const plus1Leap = addDays(leapDay, 1);
  assert.strictEqual(plus1Leap.getFullYear(), 2024);
  assert.strictEqual(plus1Leap.getMonth(), 1); // Feb
  assert.strictEqual(plus1Leap.getDate(), 29); // Leap day exists

  const plus2Leap = addDays(leapDay, 2);
  assert.strictEqual(plus2Leap.getFullYear(), 2024);
  assert.strictEqual(plus2Leap.getMonth(), 2); // Mar
  assert.strictEqual(plus2Leap.getDate(), 1);

  // 8. Invalid Date handling
  // If we pass an invalid date, new Date(invalid) gives an Invalid Date object
  // setDate on Invalid Date does not throw but keeps it Invalid
  const invalidDate = addDays(new Date('invalid-date-string'), 5);
  assert.strictEqual(Number.isNaN(invalidDate.getTime()), true);

  // 9. Null/Undefined handling (if 'd' is null/undefined, new Date(d) behaves differently)
  // new Date(null) is epoch (1970-01-01)
  const nullDate = addDays(null, 5);
  assert.strictEqual(nullDate.getFullYear(), 1970);
  assert.strictEqual(nullDate.getMonth(), 0);
  assert.strictEqual(nullDate.getDate(), 6);

  // new Date(undefined) is Invalid Date
  const undefinedDate = addDays(undefined, 5);
  assert.strictEqual(Number.isNaN(undefinedDate.getTime()), true);
});
