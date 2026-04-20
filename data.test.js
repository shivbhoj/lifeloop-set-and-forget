const test = require('node:test');
const assert = require('node:assert');
const { fmtDate, fmtLong, cycleDays } = require('./data.jsx');

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

test('cycleDays calculates days correctly for integers', (t) => {
  assert.strictEqual(cycleDays(1), 30);
  assert.strictEqual(cycleDays(6), 183);
  assert.strictEqual(cycleDays(12), 365);
});

test('cycleDays handles zero', (t) => {
  assert.strictEqual(cycleDays(0), 0);
});

test('cycleDays handles negative values', (t) => {
  assert.strictEqual(cycleDays(-1), -30);
  assert.strictEqual(cycleDays(-6), -183);
});

test('cycleDays handles very large numbers', (t) => {
  assert.strictEqual(cycleDays(1000), 30440);
  assert.strictEqual(cycleDays(10000), 304400);
});

test('cycleDays handles non-numeric types', (t) => {
  assert.ok(Number.isNaN(cycleDays(NaN)));
  assert.ok(Number.isNaN(cycleDays(undefined)));
  assert.strictEqual(cycleDays(null), 0); // null coerces to 0 in math operations
});

const { formatLastDoneDays } = require('./data.jsx');

test('formatLastDoneDays handles specific array values', (t) => {
  assert.strictEqual(formatLastDoneDays(0), 'Today');
  assert.strictEqual(formatLastDoneDays(7), '7d ago');
  assert.strictEqual(formatLastDoneDays(30), '1mo');
  assert.strictEqual(formatLastDoneDays(90), '3mo');
  assert.strictEqual(formatLastDoneDays(180), '6mo');
  assert.strictEqual(formatLastDoneDays(365), '1yr ago');
});

test('formatLastDoneDays handles boundary and arbitrary values', (t) => {
  assert.strictEqual(formatLastDoneDays(1), '1d ago');
  assert.strictEqual(formatLastDoneDays(29), '29d ago');
  assert.strictEqual(formatLastDoneDays(31), '1mo');
  assert.strictEqual(formatLastDoneDays(45), '2mo');
  assert.strictEqual(formatLastDoneDays(364), '12mo');
  assert.strictEqual(formatLastDoneDays(366), '1yr ago');
  assert.strictEqual(formatLastDoneDays(700), '2yr ago');
});
