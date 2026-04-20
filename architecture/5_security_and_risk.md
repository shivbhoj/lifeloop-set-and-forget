# Security and Risk Assessment

## OWASP Mobile Top 10 Considerations Addressed

1. **M1: Improper Platform Usage**
   - We utilize native Keystore (Android) and Keychain (iOS) via `expo-secure-store` to prevent key extraction.
2. **M2: Insecure Data Storage**
   - The local SQLite database is encrypted via SQLCipher.
   - Specific sensitive fields are double-encrypted using AES-GCM before storage to protect against DB extraction if device is rooted.
3. **M3: Insecure Communication**
   - All network traffic to Supabase uses TLS 1.3.
   - E2EE means even if TLS is compromised, the data remains unreadable.
4. **M4: Insecure Authentication**
   - Supabase Auth handles rate limiting, password policies, and secure session JWTs.
   - The master encryption key is never transmitted.
5. **M5: Insufficient Cryptography**
   - We use strong, modern primitives: AES-256-GCM for symmetric encryption and PBKDF2 (or Argon2) with heavy iteration for key derivation.

## Potential Future Risks

1. **Attachment Handling:** Storing images and PDFs securely.
   - *Risk:* Saving files to standard camera rolls or unencrypted documents folders leaks data.
   - *Mitigation:* Files must be encrypted locally before writing to disk, and decrypted into memory only when viewed.
2. **Key Recovery:**
   - *Risk:* If a user forgets their password, their master key is lost, meaning all synced E2EE data is permanently unrecoverable.
   - *Mitigation:* Generate a secure "Recovery Phrase" during onboarding that the user must write down.
3. **Background Sync Leaks:**
   - *Risk:* Push notifications via FCM/APNS might leak task names.
   - *Mitigation:* Push notifications must be entirely "Local Notifications" calculated on-device. The backend should only send generic "sync needed" silent pushes.
