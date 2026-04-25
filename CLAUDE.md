# LifeLoop — Set and Forget

A privacy-first, offline-first household task reminder app. Currently a React/HTML prototype; production target is React Native + Expo.

## Project Status

Prototype phase. The app runs as a single HTML file with JSX components loaded via Babel standalone. No build step, no package manager yet.

## Running the Prototype

Open `LifeLoop.html` directly in a browser. It loads components from:
- `data.jsx` — data models, task seeds, date utilities
- `chrome.jsx` — UI chrome (phone frame, ring, status bars)
- `screens-a.jsx` — onboarding, home, vault screens
- `screens-b.jsx` — task detail, add task, celebration, stats screens
- `android-frame.jsx` — Android Material 3 device frame

## Running Tests

```bash
node data.test.js        # date utilities and task model logic
node screens-a.test.js   # TaskRow display logic
```

Uses Node 18+ built-in `node:test` — no dependencies needed.

## Code Style

- 2-space indentation
- Extract pure functions from React components so they can be unit-tested without a DOM
  - Example: `getTaskRowDisplayInfo()` in `screens-a.jsx` is tested independently
- Descriptive function names; verb-first for pure functions (`cycleDays`, `fmtDate`, `getTaskRowDisplayInfo`)
- No TypeScript yet; add types when migrating to React Native

## Architecture

See `architecture/` for full design docs. Key decisions:

- **Offline-first** — all task logic (due dates, notifications) computed on-device; app works fully without network
- **E2EE** — backend stores only encrypted payloads; no server-side knowledge of task data
- **Zero-knowledge sync** — sorting, filtering, due-date logic never leaves the device

Planned production stack: React Native + Expo, WatermelonDB (SQLite + SQLCipher), Supabase (encrypted sync), Notifee (local notifications).

## Task Data Model

```js
{
  id, name, category, cycleMonths,
  lastDone,   // Date
  nextDue,    // Date — calculated from lastDone + cycleDays(cycleMonths)
  daysUntil,  // calculated
  note, attachments, hint
}
```

## Testing Conventions

- Write pure functions first, then wrap in React components
- Test boundary cases explicitly (overdue, due today, far future, large cycle values)
- Test file mirrors source file name: `data.jsx` → `data.test.js`

## Security Checklist (for production migration)

- Master key derived via PBKDF2/Argon2, stored in native Keystore/Keychain via `expo-secure-store`
- AES-256-GCM encryption on sensitive fields
- No plaintext task data sent to backend
- Follow OWASP Mobile Top 10 (see `architecture/5_security_and_risk.md`)
