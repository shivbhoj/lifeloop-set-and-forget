const test = require('node:test');
const assert = require('node:assert');
const { fmtDate, fmtLong, daysBetween } = require('./data.jsx');

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

test('daysBetween calculates differences correctly', (t) => {
  // Same day
  const date1 = new Date(2026, 3, 19);
  assert.strictEqual(daysBetween(date1, date1), 0);

  // Positive difference
  const date2 = new Date(2026, 3, 20); // 1 day later
  assert.strictEqual(daysBetween(date1, date2), 1);

  const date3 = new Date(2026, 4, 19); // ~1 month later
  assert.strictEqual(daysBetween(date1, date3), 30);

  // Negative difference
  assert.strictEqual(daysBetween(date2, date1), -1);

  // Leap year boundary
  const leapBefore = new Date(2024, 1, 28); // Feb 28, 2024
  const leapDay = new Date(2024, 1, 29); // Feb 29, 2024
  const leapAfter = new Date(2024, 2, 1); // Mar 1, 2024
  assert.strictEqual(daysBetween(leapBefore, leapDay), 1);
  assert.strictEqual(daysBetween(leapDay, leapAfter), 1);
  assert.strictEqual(daysBetween(leapBefore, leapAfter), 2);

  // Non-leap year boundary
  const noLeapBefore = new Date(2023, 1, 28); // Feb 28, 2023
  const noLeapAfter = new Date(2023, 2, 1); // Mar 1, 2023
  assert.strictEqual(daysBetween(noLeapBefore, noLeapAfter), 1);

  // Error handling: gracefully returns NaN for invalid inputs
  assert.ok(typeof daysBetween(null, new Date()) === 'number'); // (Date - null) coerces null to 0, gives a large number. We just verify it doesn't throw and returns a number.
  assert.ok(Number.isNaN(daysBetween(new Date(), undefined)));
  assert.ok(Number.isNaN(daysBetween("2026-04-19", new Date()))); // String is subtracted giving NaN, since string - date is NaN
  assert.ok(Number.isNaN(daysBetween(new Date('invalid'), new Date()))); // Invalid date gives NaN
});
