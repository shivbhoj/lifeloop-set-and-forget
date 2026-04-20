# Analysis and Requirements for LifeLoop

## 1. Overview
LifeLoop is a "set-and-forget" maintenance manager for cyclical tasks (e.g., home maintenance, car service, health checkups). It emphasizes a quiet, peaceful user experience with pre-nudges and launch-day notifications.

## 2. Target Platform
Based on user input and the design files (`android-frame.jsx`, `LifeLoop.html`):
- **Platform:** Mobile Application (iOS and Android).
- **Architecture Approach:** React Native (with Expo) is ideal to achieve a cross-platform release efficiently while matching the provided React-based prototype design closely.

## 3. Key Functional Requirements
- **Single-User Focus:** Initial version targets core single-user functionality.
- **Offline-First / Critical:** The app must function fully offline.
- **Background Processing:** Reliable background push notifications (pre-nudges and launch-day alerts) are critical.
- **Data Security:** The application stores highly sensitive personal data. End-to-End Encryption (E2EE) is required, even for backups or syncing.
- **Cost-Effectiveness:** A cost-effective cloud provider for backend sync/backup is needed.

## 4. UI/UX & Data Models
From `data.jsx`:
- **Models:**
  - `Task`: Contains `id`, `name`, `category`, `cycleMonths`, `lastDone`, `nextDue`, `daysUntil`, `note`, `attachments`, `hint`.
  - `Template`: Bundles of tasks for easy onboarding.
- **UX Flow:** Onboarding -> Home (Upcoming) -> Vault (All tasks) -> Task Details -> Celebration/Reset.

## 5. Security & Ambiguities Addressed
- E2EE is a must to protect notes and attachment metadata.
- Attachments will likely need secure local storage and potentially secure blob storage if synced.
- The user requested strict adherence to OWASP Mobile Top 10.
