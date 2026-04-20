# Initial Architecture Proposal

## Overview
To meet the requirements of offline-first capability, highly sensitive personal data security, and cost-effectiveness, the following architecture is proposed.

## 1. Frontend Framework: React Native (Expo)
- **Why:** Allows for rapid cross-platform (iOS and Android) development while reusing much of the UI logic and styling from the provided React prototypes (`screens-a.jsx`, `screens-b.jsx`).
- **Security:** Expo handles native build security, and we will use `expo-secure-store` for critical secrets (e.g., encryption keys).

## 2. Local Database (Offline-First): WatermelonDB
- **Why:** WatermelonDB is designed specifically for React Native apps that need offline-first functionality and complex queries without blocking the UI thread. It runs on top of SQLite.
- **Security:** We will use `SQLCipher` (an SQLite extension) for full database encryption on the device.

## 3. Backend & Sync: Supabase
- **Why:** Supabase is a highly cost-effective, open-source Firebase alternative based on PostgreSQL.
- **Security:** We will implement an End-to-End Encryption (E2EE) model. The backend will only store encrypted payloads for task notes, names, and attachments. The server will have zero-knowledge of the user data.

## 4. Background Notifications: Expo Notifications / Notifee
- **Why:** Critical for "pre-nudges" and "launch day" alerts.
- **Approach:** Schedule local notifications on the device based on the `nextDue` calculations. This keeps the sensitive due-date logic entirely on-device, preventing the backend from knowing when tasks are due.

## 5. Security & E2EE Implementation
- **Key Generation:** Generate a master encryption key using Argon2id or PBKDF2 from a user's password or an auto-generated recovery phrase.
- **Key Storage:** Store the local key securely in the OS's Keychain/Keystore via `expo-secure-store`.
- **Encryption:** Use `react-native-quick-crypto` or `libsodium` for strong, fast symmetric encryption (e.g., XChaCha20-Poly1305) of the task data before it hits the local SQLite DB or Supabase.
