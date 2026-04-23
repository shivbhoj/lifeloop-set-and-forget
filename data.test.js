const test = require('node:test');
const assert = require('node:assert');
const { fmtDate, fmtLong, cycleDays, mkTask } = require('./data.jsx');

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

test('mkTask creates a task with correct date calculations', (t) => {
  const task = mkTask('id1', 'Test Task', 'admin', 2, 10);
  assert.strictEqual(task.id, 'id1');
  assert.strictEqual(task.name, 'Test Task');
  assert.strictEqual(task.category, 'admin');
  assert.strictEqual(task.cycleMonths, 2);

  // lastDone = TODAY - 10 days = April 9, 2026
  assert.strictEqual(task.lastDone.getFullYear(), 2026);
  assert.strictEqual(task.lastDone.getMonth(), 3); // April
  assert.strictEqual(task.lastDone.getDate(), 9);

  // cycleMonths = 2 -> cycleDays = Math.round(2 * 30.44) = 61 days
  // nextDue = April 9 + 61 days = June 9, 2026
  assert.strictEqual(task.nextDue.getFullYear(), 2026);
  assert.strictEqual(task.nextDue.getMonth(), 5); // June
  assert.strictEqual(task.nextDue.getDate(), 9);

  // daysUntil = daysBetween(April 19, June 9)
  // April has 30 days -> 11 days left. May has 31. June has 9. 11 + 31 + 9 = 51.
  assert.strictEqual(task.daysUntil, 51);

  // Default opts
  assert.strictEqual(task.note, '');
  assert.deepStrictEqual(task.attachments, []);
  assert.strictEqual(task.hint, '');
});

test('mkTask handles omitting the opts parameter entirely', (t) => {
  const task = mkTask('id2', 'Task No Opts', 'home', 1, 0);
  assert.strictEqual(task.note, '');
  assert.deepStrictEqual(task.attachments, []);
  assert.strictEqual(task.hint, '');
});

test('mkTask handles an empty opts object', (t) => {
  const task = mkTask('id3', 'Task Empty Opts', 'health', 1, 0, {});
  assert.strictEqual(task.note, '');
  assert.deepStrictEqual(task.attachments, []);
  assert.strictEqual(task.hint, '');
});

test('mkTask handles a full opts object', (t) => {
  const opts = {
    note: 'Custom note',
    attachments: [{ kind: 'img', label: 'test.jpg' }],
    hint: 'Custom hint',
  };
  const task = mkTask('id4', 'Task Full Opts', 'finance', 1, 0, opts);
  assert.strictEqual(task.note, 'Custom note');
  assert.deepStrictEqual(task.attachments, opts.attachments);
  assert.strictEqual(task.hint, 'Custom hint');
});

test('mkTask handles a negative lastDoneOffset', (t) => {
  // If lastDoneOffset is -5, lastDone is TODAY + 5 days = April 24, 2026
  const task = mkTask('id5', 'Future Task', 'home', 1, -5);

  assert.strictEqual(task.lastDone.getFullYear(), 2026);
  assert.strictEqual(task.lastDone.getMonth(), 3);
  assert.strictEqual(task.lastDone.getDate(), 24);

  // cycleMonths = 1 -> 30 days
  // nextDue = April 24 + 30 days = May 24, 2026
  assert.strictEqual(task.nextDue.getFullYear(), 2026);
  assert.strictEqual(task.nextDue.getMonth(), 4);
  assert.strictEqual(task.nextDue.getDate(), 24);

  // daysUntil = daysBetween(April 19, May 24) = 11 (Apr) + 24 (May) = 35
  assert.strictEqual(task.daysUntil, 35);
});
