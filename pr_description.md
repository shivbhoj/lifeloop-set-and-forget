🧪 Extract TaskRow logic to pure function and add test suite

🎯 **What:** The testing gap in `TaskRow` from `screens-a.jsx` has been addressed. The component previously had complex logic for display calculations (like `progress`, `dueLabel`, and `ringColor`) tightly coupled inside a React component, making it impossible to unit test without bringing in heavy React DOM testing libraries. I have extracted this pure calculation logic into a standalone JavaScript helper function, `getTaskRowDisplayInfo`.

📊 **Coverage:** A new test suite, `screens-a.test.js`, has been added. It covers the following scenarios:
* Overdue tasks
* Tasks due today, tomorrow, within 14 days, and after 14 days
* Correct calculation of the task `progress` fraction
* Boundary cases: precisely 0 days into a cycle, and reaching maximum (`1`) or minimum (`0`) bounds for cycle progress, safeguarding against possible `NaN` occurrences if `cycleDays` reaches `0`.

✨ **Result:** The logic defining how tasks are visually tracked in the `TaskRow` is now completely covered by our built-in `node:test` framework. We improved reliability and testing coverage for the codebase with zero added dependencies, sticking exactly to the project's established conventions.
