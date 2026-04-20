const test = require('node:test');
const assert = require('node:assert');
const { fmtDate, fmtLong } = require('./data.jsx');

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
