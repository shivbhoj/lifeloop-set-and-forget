// Foundational code snippets and boilerplate for LifeLoop

/**
 * 1. MODELS (WatermelonDB Example)
 * ----------------------------------------------------
 * We store sensitive fields as a single encrypted JSON payload
 * to minimize the attack surface and simplify the sync logic.
 */
import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class Task extends Model {
  static table = 'tasks';

  // Server doesn't see inside 'encrypted_payload'.
  // It contains { name, note, category, attachmentsMeta }
  @field('encrypted_payload') encryptedPayload;

  // These might need to be plaintext for local querying/sorting,
  // but if absolute zero-knowledge is required, we do all sorting
  // in memory after decryption. For this app, cycle logic is local.
  @field('cycle_months') cycleMonths;
  @date('last_done') lastDone;
  @date('next_due') nextDue;
}

/**
 * 2. SECURE AUTHENTICATION BOILERPLATE (Supabase & Crypto)
 * ----------------------------------------------------
 * On signup, we generate a master key derived from the password.
 * The server NEVER sees this key.
 */
import * as SecureStore from 'expo-secure-store';
import { supabase } from './supabaseClient';
import { pbkdf2, randomBytes } from 'react-native-quick-crypto';

export const signUpSecurely = async (email, password) => {
  // 1. Generate salt and derive local E2EE master key
  const salt = randomBytes(16).toString('hex');
  const masterKey = pbkdf2.deriveKey(password, salt, 100000, 32, 'sha256').toString('hex');

  // 2. Store master key securely in native hardware Keystore/Keychain
  await SecureStore.setItemAsync('E2EE_MASTER_KEY', masterKey);
  await SecureStore.setItemAsync('E2EE_SALT', salt);

  // 3. Register user with Supabase Auth
  // Note: We might hash the password *again* before sending to Supabase
  // to ensure Supabase never gets the same string used for deriving the master key.
  const authPassword = pbkdf2.deriveKey(password, 'SERVER_SALT', 1000, 32, 'sha256').toString('hex');

  const { data, error } = await supabase.auth.signUp({
    email,
    password: authPassword,
  });

  if (error) throw new Error(error.message);
  return data;
};

/**
 * 3. E2EE ENCRYPTION UTILS
 * ----------------------------------------------------
 * Encrypting the task payload using AES-256-GCM.
 */
import { createCipheriv, createDecipheriv } from 'react-native-quick-crypto';

export const encryptPayload = async (dataObject) => {
  const masterKeyHex = await SecureStore.getItemAsync('E2EE_MASTER_KEY');
  const key = Buffer.from(masterKeyHex, 'hex');
  const iv = randomBytes(12); // GCM standard IV size
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(JSON.stringify(dataObject), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    iv: iv.toString('hex'),
    ciphertext: encrypted,
    authTag: authTag,
  }; // This object is stringified and saved to WatermelonDB
};

/**
 * 4. NOTIFICATION SCHEDULING
 * ----------------------------------------------------
 * Scheduled locally on the device so the server is blind to user activity.
 */
import * as Notifications from 'expo-notifications';

export const schedulePreNudge = async (taskId, taskName, nextDue) => {
  // Example: 7 days before due date
  const triggerDate = new Date(nextDue);
  triggerDate.setDate(triggerDate.getDate() - 7);

  if (triggerDate > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'LifeLoop Pre-Nudge',
        body: `${taskName} is coming up in a week.`,
        data: { taskId },
      },
      trigger: { date: triggerDate },
    });
  }
};
