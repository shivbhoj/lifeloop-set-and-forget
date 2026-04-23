const test = require('node:test');
const assert = require('node:assert');

// We have to mock cycleDays and fmtDate as they would be provided in browser environment
const { CATEGORIES, cycleDays, fmtDate, TODAY, addDays, daysBetween } = require('./data.jsx');

// Read the function from screens-a.jsx manually because it contains JSX which fails to load in node directly
const fs = require('fs');
const code = fs.readFileSync('screens-a.jsx', 'utf8');

// Use a simple extraction of the function source code from screens-a.jsx
const match = code.match(/function getTaskRowDisplayInfo\s*\([\s\S]*?return {[^}]+};\n}/);
if (!match) {
  throw new Error("Could not find getTaskRowDisplayInfo in screens-a.jsx");
}

const getTaskRowDisplayInfo = new Function(`return ${match[0]}`)();

const palette = {
  inkSoft: 'inkSoft-color'
};

const mockFmtDate = (date) => `formatted-${date.getTime()}`;

const createMockTask = (daysUntil, cycleMonths = 1, category = 'home') => {
  return {
    cycleMonths,
    daysUntil,
    category,
    nextDue: new Date(2026, 3, 19 + daysUntil) // April 19, 2026 + daysUntil
  };
};

test('getTaskRowDisplayInfo handles overdue tasks', (t) => {
  const task = createMockTask(-5); // 5 days overdue
  const result = getTaskRowDisplayInfo(task, palette, CATEGORIES, cycleDays, mockFmtDate);

  assert.strictEqual(result.due, -5);
  assert.strictEqual(result.isOverdue, true);
  assert.strictEqual(result.isSoon, false);
  assert.strictEqual(result.dueLabel, '5d overdue');
  assert.strictEqual(result.ringColor, 'oklch(0.55 0.12 30)');
});

test('getTaskRowDisplayInfo handles tasks due today (0 days)', (t) => {
  const task = createMockTask(0);
  const result = getTaskRowDisplayInfo(task, palette, CATEGORIES, cycleDays, mockFmtDate);

  assert.strictEqual(result.due, 0);
  assert.strictEqual(result.isOverdue, false);
  assert.strictEqual(result.isSoon, true);
  assert.strictEqual(result.dueLabel, 'Due today');
  assert.strictEqual(result.ringColor, CATEGORIES['home'].dot);
});

test('getTaskRowDisplayInfo handles tasks due tomorrow (1 day)', (t) => {
  const task = createMockTask(1);
  const result = getTaskRowDisplayInfo(task, palette, CATEGORIES, cycleDays, mockFmtDate);

  assert.strictEqual(result.due, 1);
  assert.strictEqual(result.isOverdue, false);
  assert.strictEqual(result.isSoon, true);
  assert.strictEqual(result.dueLabel, 'Tomorrow');
  assert.strictEqual(result.ringColor, CATEGORIES['home'].dot);
});

test('getTaskRowDisplayInfo handles tasks due within 14 days', (t) => {
  const task = createMockTask(10);
  const result = getTaskRowDisplayInfo(task, palette, CATEGORIES, cycleDays, mockFmtDate);

  assert.strictEqual(result.due, 10);
  assert.strictEqual(result.isOverdue, false);
  assert.strictEqual(result.isSoon, true);
  assert.strictEqual(result.dueLabel, 'In 10 days');
  assert.strictEqual(result.ringColor, CATEGORIES['home'].dot);
});

test('getTaskRowDisplayInfo handles tasks due exactly 14 days', (t) => {
  const task = createMockTask(14);
  const result = getTaskRowDisplayInfo(task, palette, CATEGORIES, cycleDays, mockFmtDate);

  assert.strictEqual(result.due, 14);
  assert.strictEqual(result.isOverdue, false);
  assert.strictEqual(result.isSoon, true);
  assert.strictEqual(result.dueLabel, 'In 14 days');
  assert.strictEqual(result.ringColor, CATEGORIES['home'].dot);
});

test('getTaskRowDisplayInfo handles tasks due after 14 days', (t) => {
  const task = createMockTask(15);
  const result = getTaskRowDisplayInfo(task, palette, CATEGORIES, cycleDays, mockFmtDate);

  assert.strictEqual(result.due, 15);
  assert.strictEqual(result.isOverdue, false);
  assert.strictEqual(result.isSoon, false);
  // Uses formatting function
  assert.strictEqual(result.dueLabel, mockFmtDate(task.nextDue));
  assert.strictEqual(result.ringColor, palette.inkSoft);
});

test('getTaskRowDisplayInfo calculates progress correctly', (t) => {
  // Cycle is 1 month (~30 days). Due in 15 days means 15 days into the cycle.
  // 15/30 = 0.5 progress
  const task = createMockTask(15, 1); // 1 month cycle = ~30 days
  const totalDays = cycleDays(1); // 30

  const result = getTaskRowDisplayInfo(task, palette, CATEGORIES, cycleDays, mockFmtDate);

  const expectedDaysInto = totalDays - 15; // 30 - 15 = 15
  assert.strictEqual(result.totalCycle, totalDays);
  assert.strictEqual(result.daysInto, expectedDaysInto);
  assert.strictEqual(result.progress, expectedDaysInto / totalDays);
});

test('getTaskRowDisplayInfo calculates progress properly when exactly 0 days into cycle', (t) => {
  // Just completed, so it's due in a full cycle (e.g., 30 days)
  const totalDays = cycleDays(1);
  const task = createMockTask(totalDays, 1);

  const result = getTaskRowDisplayInfo(task, palette, CATEGORIES, cycleDays, mockFmtDate);

  assert.strictEqual(result.daysInto, 0);
  assert.strictEqual(result.progress, 0);
});

test('getTaskRowDisplayInfo bounds progress to max 1', (t) => {
  // Overdue task, daysInto > totalCycle
  const task = createMockTask(-5, 1);
  const result = getTaskRowDisplayInfo(task, palette, CATEGORIES, cycleDays, mockFmtDate);

  // Progress should max out at 1
  assert.strictEqual(result.progress, 1);
});

test('getTaskRowDisplayInfo bounds progress to min 0', (t) => {
  // A task somehow has daysUntil > totalCycle (perhaps just created and set due far in future)
  const totalDays = cycleDays(1);
  const task = createMockTask(totalDays + 5, 1);
  const result = getTaskRowDisplayInfo(task, palette, CATEGORIES, cycleDays, mockFmtDate);

  // Progress should not go negative
  assert.strictEqual(result.progress, 0);
});

test('getTaskRowDisplayInfo handles total cycle of 0 gracefully', (t) => {
  const task = createMockTask(5, 0); // 0 month cycle
  const result = getTaskRowDisplayInfo(task, palette, CATEGORIES, cycleDays, mockFmtDate);

  assert.strictEqual(result.totalCycle, 0);
  assert.strictEqual(result.progress, 0); // Should be 0, avoid NaN or Infinity
});
