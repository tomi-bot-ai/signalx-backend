import 'dotenv/config';
import admin from 'firebase-admin';
import { log } from '../utils/logger.js';

let enabled = false;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID || '';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || '';
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey })
    });
    enabled = true;
    log.info({ projectId }, 'FCM initialized');
  } else {
    log.warn('FCM disabled: missing credentials');
  }
} catch (e) {
  log.warn({ err: e.message }, 'FCM init failed');
}

export async function pushSignal(topicOrToken, payload) {
  if (!enabled) return false;
  try {
    await admin.messaging().send({
      topic: topicOrToken,
      data: Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v)])),
      android: { priority: 'high' }
    });
    return true;
  } catch (e) {
    log.error({ err: e.message }, 'FCM send failed');
    return false;
  }
}
