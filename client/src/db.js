// src/db.js
import { openDB } from 'idb';

const DB_NAME = 'imageDB';
const DB_VERSION = 1;
const STORE_NAME = 'images';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    }
  });
}

export async function saveImage(imageData) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.add({
    image: imageData,
    date: new Date()
  });
  await tx.done;
  console.log('✅ Imagen guardada en IndexedDB');
}
