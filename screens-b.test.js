const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('vm');
const { cycleDays } = require('./data.jsx');

// Read screens-b.jsx and extract the getTaskDetailState function as a string
const code = fs.readFileSync('screens-b.jsx', 'utf-8');
const regex = /const getTaskDetailState = \([\s\S]*?\n\};/;
const match = code.match(regex);
if (!match) {
  throw new Error('Could not find getTaskDetailState in screens-b.jsx');
}

// Create a new context and evaluate the function string into it
const evalCode = match[0] + '\n module.exports = { getTaskDetailState };';
const moduleObj = { exports: {} };
const context = vm.createContext({
  module: moduleObj,
  Math: Math,
});
vm.runInContext(evalCode, context);
const getTaskDetailState = moduleObj.exports.getTaskDetailState;

test('getTaskDetailState - happy path', (t) => {
  const task = { cycleMonths: 2, daysUntil: 30 };
  const palette = { accentSage: 'sage', accent: 'accent' };

  const state = getTaskDetailState(task, palette, cycleDays);

  // 2 months = 61 days (Math.round(2 * 30.44) = 61)
  assert.strictEqual(state.totalCycle, 61);
  assert.strictEqual(state.daysInto, 31); // 61 - 30 = 31
  assert.strictEqual(state.progress, 31 / 61);
  assert.strictEqual(state.due, 30);
  assert.strictEqual(state.isOverdue, false);
  assert.strictEqual(state.isLaunchDay, false);
  assert.strictEqual(state.ringColor, 'sage');
});

test('getTaskDetailState - isLaunchDay (exact boundary: 0)', (t) => {
  const task = { cycleMonths: 1, daysUntil: 0 };
  const palette = { accentSage: 'sage', accent: 'accent' };

  const state = getTaskDetailState(task, palette, cycleDays);

  // 1 month = 30 days
  assert.strictEqual(state.totalCycle, 30);
  assert.strictEqual(state.daysInto, 30);
  assert.strictEqual(state.progress, 1);
  assert.strictEqual(state.due, 0);
  assert.strictEqual(state.isOverdue, false);
  assert.strictEqual(state.isLaunchDay, true);
  assert.strictEqual(state.ringColor, 'accent');
});

test('getTaskDetailState - isOverdue (boundary: -1)', (t) => {
  const task = { cycleMonths: 1, daysUntil: -1 };
  const palette = { accentSage: 'sage', accent: 'accent' };

  const state = getTaskDetailState(task, palette, cycleDays);

  assert.strictEqual(state.totalCycle, 30);
  assert.strictEqual(state.daysInto, 31);
  // progress should be capped at 1
  assert.strictEqual(state.progress, 1);
  assert.strictEqual(state.due, -1);
  assert.strictEqual(state.isOverdue, true);
  assert.strictEqual(state.isLaunchDay, true);
  assert.strictEqual(state.ringColor, 'oklch(0.55 0.12 30)');
});

test('getTaskDetailState - negative progress capped at 0', (t) => {
  const task = { cycleMonths: 2, daysUntil: 80 }; // Next due is further out than cycle (e.g. newly created)
  const palette = { accentSage: 'sage', accent: 'accent' };

  const state = getTaskDetailState(task, palette, cycleDays);

  assert.strictEqual(state.totalCycle, 61);
  assert.strictEqual(state.daysInto, -19); // 61 - 80 = -19
  // progress should be capped at 0
  assert.strictEqual(state.progress, 0);
  assert.strictEqual(state.due, 80);
});

test('getTaskDetailState - zero-length cycle', (t) => {
  const task = { cycleMonths: 0, daysUntil: 5 };
  const palette = { accentSage: 'sage', accent: 'accent' };

  const state = getTaskDetailState(task, palette, cycleDays);

  assert.strictEqual(state.totalCycle, 0);
  assert.strictEqual(state.daysInto, -5);
  // should not be NaN
  assert.strictEqual(state.progress, 0);
});

test('getTaskDetailState - zero-length cycle, launched', (t) => {
  const task = { cycleMonths: 0, daysUntil: 0 };
  const palette = { accentSage: 'sage', accent: 'accent' };

  const state = getTaskDetailState(task, palette, cycleDays);

  assert.strictEqual(state.totalCycle, 0);
  assert.strictEqual(state.daysInto, 0);
  // should cap at 1 if due is 0
  assert.strictEqual(state.progress, 1);
});
