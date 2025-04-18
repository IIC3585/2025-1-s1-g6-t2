import { openDB } from 'idb';

const DB_NAME = 'notifications-db';
const STORE_NAME = 'notifications';

export async function initNotificationsDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
}

export async function saveNotification(data) {
  const db = await initNotificationsDB();
  await db.add(STORE_NAME, {
    ...data,
    timestamp: new Date().toISOString()
  });
}

export async function getAllNotifications() {
  const db = await initNotificationsDB();
  return db.getAll(STORE_NAME);
}

export async function clearNotifications() {
  const db = await initNotificationsDB();
  return db.clear(STORE_NAME);
}