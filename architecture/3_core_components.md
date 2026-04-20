# Core Components

## 1. Local Database & Models (WatermelonDB)
- **`Task` Model:** Stores `id`, encrypted `payload` (name, note, category), `cycleMonths`, `lastDone`, `nextDue`.
- **Sync Engine:** Observes local changes and pushes them to Supabase, pulls remote changes, and handles conflict resolution.

## 2. E2EE Crypto Manager
- **Responsibilities:**
  - Generating and securely storing the master encryption key (`expo-secure-store`).
  - Providing `encrypt(data)` and `decrypt(data)` functions using AES-256-GCM or XChaCha20-Poly1305.
- **Interactions:** Wraps the `Task` model's sensitive fields before saving to the local DB or syncing.

## 3. Background Notification Scheduler
- **Responsibilities:**
  - Calculates notification times based on `nextDue` and user preferences (e.g., pre-nudge window).
  - Uses `Notifee` or `expo-notifications` to schedule local push alerts.
- **Interactions:** Listens to `Task` changes in the DB and recalculates triggers automatically.

## 4. Authentication Flow (Supabase Auth)
- **Responsibilities:**
  - Handles user sign-up, login, and session management.
  - Ensures robust password hashing and MFA if enabled.
- **Interactions:** Retrieves the Auth token needed to connect to the Supabase Postgres instance securely.
